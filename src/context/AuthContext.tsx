import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { AuthFormValues, User } from '../types/user';
import { isAllowedEmailDomain } from '../utils/emailProviders';
import { supabase } from '../services/supabaseClient';
import { createInitialMascotProgress } from '../services/mascotDb';

type AuthResult = { ok: true } | { ok: false; error: string };

interface AuthContextValue {
  currentUser: User | null;
  /** true enquanto a sessão salva (se houver) ainda está sendo restaurada do banco. */
  isLoading: boolean;
  signUp: (values: AuthFormValues) => Promise<AuthResult>;
  logIn: (values: AuthFormValues) => Promise<AuthResult>;
  logOut: () => void;
  updateProfile: (updater: (prev: User) => User) => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

/**
 * Valida que um e-mail tem uma estrutura bem-formada (texto antes do @, um
 * domínio, uma extensão separada por ponto) E que o domínio é de um
 * provedor real e conhecido (ver utils/emailProviders.ts). Isso bloqueia
 * domínios inventados como "user@kkk.com" que passariam numa checagem só de
 * formato.
 */
export function isValidEmail(email: string): boolean {
  const wellFormed = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  return wellFormed && isAllowedEmailDomain(email);
}

function translateAuthError(message: string): string {
  const m = message.toLowerCase();
  if (m.includes('already registered') || m.includes('already exists')) return 'Já existe uma conta com esse e-mail.';
  if (m.includes('invalid login credentials')) return 'E-mail ou senha incorretos.';
  if (m.includes('email not confirmed')) return 'Confirme seu e-mail antes de entrar (verifique sua caixa de entrada).';
  if (m.includes('password')) return 'A senha precisa ter ao menos 6 caracteres.';
  if (m.includes('rate limit')) return 'Muitas tentativas seguidas. Aguarde um instante e tente de novo.';
  return 'Não foi possível concluir. Verifique sua conexão e tente novamente.';
}

interface ProfileRow {
  id: string;
  name: string;
  email: string;
  avatar_data_url: string | null;
  bio: string;
  created_at: string;
}

function rowToUser(row: ProfileRow): User {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    avatarDataUrl: row.avatar_data_url,
    bio: row.bio,
    createdAt: row.created_at,
  };
}

/**
 * Usuários agora são contas reais no Supabase Auth (e-mail/senha
 * verificados no servidor, nunca guardados no navegador), com os dados de
 * perfil espelhados na tabela `profiles`. Isso é o que permite o mesmo
 * usuário sair e entrar depois — inclusive em outro dispositivo — e
 * continuar com os mesmos dados: a sessão local (`onAuthStateChange`) só
 * decide QUANDO recarregar o perfil; quem garante que o progresso é o
 * mesmo em qualquer lugar é o banco.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadProfile = useCallback(async (userId: string) => {
    const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle();
    if (error) {
      console.warn('[auth] Falha ao carregar perfil do banco de dados.', error);
      return;
    }
    if (data) setCurrentUser(rowToUser(data as ProfileRow));
  }, []);

  useEffect(() => {
    let active = true;

    supabase.auth.getSession().then(({ data }) => {
      const userId = data.session?.user.id;
      if (!userId) {
        if (active) setIsLoading(false);
        return;
      }
      loadProfile(userId).finally(() => {
        if (active) setIsLoading(false);
      });
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        loadProfile(session.user.id);
      } else {
        setCurrentUser(null);
      }
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, [loadProfile]);

  const signUp = useCallback(
    async (values: AuthFormValues): Promise<AuthResult> => {
      const email = values.email.trim().toLowerCase();
      const name = values.name?.trim() ?? '';

      if (!name) return { ok: false, error: 'Digite seu nome.' };
      if (!isValidEmail(email)) return { ok: false, error: 'Digite um e-mail válido.' };
      if (values.password.length < 6) return { ok: false, error: 'A senha precisa ter ao menos 6 caracteres.' };

      const { data, error } = await supabase.auth.signUp({ email, password: values.password, options: { data: { name } } });
      if (error) return { ok: false, error: translateAuthError(error.message) };
      const userId = data.user?.id;
      if (!userId) return { ok: false, error: 'Não foi possível criar a conta. Tente novamente.' };

      const { error: profileError } = await supabase.from('profiles').insert({ id: userId, name, email });
      if (profileError) {
        console.warn('[auth] Falha ao criar perfil.', profileError);
        return { ok: false, error: 'Conta criada, mas houve um erro ao salvar seu perfil. Tente entrar de novo em instantes.' };
      }

      try {
        await createInitialMascotProgress(userId, 'Rio');
      } catch (mascotError) {
        // Não bloqueia o cadastro — MascotContext cria essa linha sob demanda
        // (fetchMascotState) se ela ainda não existir quando o app carregar.
        console.warn('[auth] Falha ao criar progresso inicial do mascote.', mascotError);
      }

      if (!data.session) {
        // O projeto Supabase está com "Confirm email" ativado (padrão em
        // projetos novos): a conta foi criada, mas só é possível entrar
        // depois de confirmar o e-mail recebido. Para o app entrar direto
        // após o cadastro (como no comportamento original), desative
        // "Confirm email" em Authentication -> Providers -> Email no painel
        // do Supabase — ver README.
        return { ok: false, error: 'Conta criada! Confirme seu e-mail (verifique sua caixa de entrada) e depois entre normalmente.' };
      }

      await loadProfile(userId);
      return { ok: true };
    },
    [loadProfile]
  );

  const logIn = useCallback(
    async (values: AuthFormValues): Promise<AuthResult> => {
      const email = values.email.trim().toLowerCase();
      if (!isValidEmail(email)) return { ok: false, error: 'Digite um e-mail válido.' };

      const { data, error } = await supabase.auth.signInWithPassword({ email, password: values.password });
      if (error) return { ok: false, error: 'E-mail ou senha incorretos.' };
      if (data.user) await loadProfile(data.user.id);
      return { ok: true };
    },
    [loadProfile]
  );

  const logOut = useCallback(() => {
    supabase.auth.signOut();
    setCurrentUser(null);
  }, []);

  const updateProfile = useCallback((updater: (prev: User) => User) => {
    setCurrentUser((prev) => {
      if (!prev) return prev;
      const next = updater(prev);
      supabase
        .from('profiles')
        .update({ name: next.name, avatar_data_url: next.avatarDataUrl, bio: next.bio })
        .eq('id', next.id)
        .then((res) => {
          if (res.error) console.warn('[auth] Falha ao salvar perfil no banco de dados.', res.error);
        });
      return next;
    });
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ currentUser, isLoading, signUp, logIn, logOut, updateProfile }),
    [currentUser, isLoading, signUp, logIn, logOut, updateProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
