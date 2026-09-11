import { useState, type FormEvent } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { MascotAvatar } from '../components/MascotAvatar';
import { Logo } from '../components/Logo';
import { useAuth } from '../hooks/useAuth';

export function Login() {
  const [searchParams] = useSearchParams();
  const [mode, setMode] = useState<'login' | 'cadastro'>(searchParams.get('modo') === 'cadastro' ? 'cadastro' : 'login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { logIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    const result = mode === 'login' ? logIn({ email, password }) : signUp({ name, email, password });
    if (result.ok) navigate('/app');
    else setError(result.error);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="hidden lg:flex flex-col items-center text-center gap-4 px-6">
          <MascotAvatar stage="young" color="#3F6B58" size={180} />
          <h2 className="font-display text-2xl font-semibold">{mode === 'login' ? 'Que bom te ver de novo' : 'Bem-vindo(a) ao Buddy'}</h2>
          <p className="text-(--color-ink-muted) max-w-xs">Seu mascote está te esperando para evoluir junto com sua rotina.</p>
        </div>

        <Card className="w-full max-w-md mx-auto">
          <div className="flex items-center gap-2 font-display font-semibold text-lg mb-6 justify-center lg:justify-start">
            <Logo size={32} />
            Buddy
          </div>

          <div role="tablist" className="inline-flex items-center gap-1 p-1 rounded-full bg-(--color-surface-alt) mb-6 w-full">
            <button role="tab" aria-selected={mode === 'login'} onClick={() => setMode('login')} className={`flex-1 px-4 py-2 rounded-full text-sm font-semibold transition-all ${mode === 'login' ? 'bg-(--color-focus) text-white shadow-(--shadow-soft)' : 'text-(--color-ink-muted)'}`}>
              Entrar
            </button>
            <button role="tab" aria-selected={mode === 'cadastro'} onClick={() => setMode('cadastro')} className={`flex-1 px-4 py-2 rounded-full text-sm font-semibold transition-all ${mode === 'cadastro' ? 'bg-(--color-focus) text-white shadow-(--shadow-soft)' : 'text-(--color-ink-muted)'}`}>
              Criar conta
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {mode === 'cadastro' && (
              <div>
                <label htmlFor="name" className="text-sm font-medium block mb-1.5">Nome</label>
                <input id="name" type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-xl border border-(--color-border) bg-(--color-bg) px-4 py-2.5 text-sm" placeholder="Como podemos te chamar?" />
              </div>
            )}

            <div>
              <label htmlFor="email" className="text-sm font-medium block mb-1.5">E-mail</label>
              <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-xl border border-(--color-border) bg-(--color-bg) px-4 py-2.5 text-sm" placeholder="voce@gmail.com" />
              {mode === 'cadastro' && <p className="text-xs text-(--color-ink-muted) mt-1.5">Use um e-mail de um provedor conhecido (Gmail, Outlook, Hotmail, Yahoo, iCloud...).</p>}
            </div>

            <div>
              <label htmlFor="password" className="text-sm font-medium block mb-1.5">Senha</label>
              <input id="password" type="password" required minLength={mode === 'cadastro' ? 6 : undefined} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-xl border border-(--color-border) bg-(--color-bg) px-4 py-2.5 text-sm" placeholder="••••••••" />
            </div>

            {error && <p className="text-sm text-(--color-danger)">{error}</p>}

            <Button type="submit" size="lg" className="w-full mt-2">{mode === 'login' ? 'Entrar' : 'Criar minha conta'}</Button>
          </form>

          <p className="text-xs text-(--color-ink-muted) text-center mt-5">Seus dados ficam salvos neste dispositivo/navegador.</p>
          <p className="text-center mt-4">
            <Link to="/" className="text-sm text-(--color-ink-muted) hover:text-(--color-ink) underline">Voltar para a página inicial</Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
