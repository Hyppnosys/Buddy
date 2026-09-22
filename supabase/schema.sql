-- Buddy — esquema do banco de dados (Supabase / Postgres)
--
-- Como usar:
--   1. Crie um projeto gratuito em https://supabase.com.
--   2. Abra "SQL Editor" no painel do projeto, cole este arquivo inteiro e
--      rode ("Run"). Ele cria as 4 tabelas abaixo, os índices, e as
--      políticas de segurança (RLS) que garantem que cada usuário só
--      enxerga/edita os próprios dados.
--   3. Em "Project Settings -> API", copie a "Project URL" e a chave
--      "anon public" e cole em um arquivo `.env.local` na raiz do projeto
--      (veja `.env.example`).
--
-- Este arquivo é idempotente: pode ser rodado de novo sem duplicar nada
-- (usa "if not exists" e "drop policy if exists").

-- 1. PERFIS (dados públicos/básicos de cada usuário, 1-para-1 com auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  name text not null,
  email text not null,
  avatar_data_url text,
  bio text not null default '',
  created_at timestamptz not null default now()
);

-- 2. PROGRESSO DO MASCOTE (fase atual, barra da fase, pontos extras, XP total)
create table if not exists public.mascot_progress (
  user_id uuid primary key references public.profiles (id) on delete cascade,
  mascot_name text not null default 'Rio',
  -- 'hatchling' (Bebê) -> 'young' (Jovem) -> 'grown' (Adulto)
  stage text not null default 'hatchling' check (stage in ('hatchling', 'young', 'grown')),
  -- pontos dentro da barra da fase ATUAL — volta a 0 a cada evolução
  phase_progress integer not null default 0,
  -- só cresce depois que stage = 'grown' ("pontuação extra")
  extra_points integer not null default 0,
  -- total histórico de pontos, nunca reseta (estatística/histórico)
  total_xp integer not null default 0,
  -- fases já concluídas, em ordem, ex: {hatchling,young} quando Adulto
  completed_phases text[] not null default '{}',
  shared_with_friend_ids uuid[] not null default '{}',
  updated_at timestamptz not null default now()
);

-- 3. HISTÓRICO DE ATIVIDADES (o que gerou pontos para o mascote)
create table if not exists public.mascot_activity_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  reason text not null,
  points integer not null,
  by_name text not null default 'Você',
  created_at timestamptz not null default now()
);
create index if not exists mascot_activity_log_user_id_idx on public.mascot_activity_log (user_id, created_at desc);

-- 4. AMIZADES (pedido -> pendente -> aceito/recusado)
create table if not exists public.friendships (
  id uuid primary key default gen_random_uuid(),
  requester_id uuid not null references public.profiles (id) on delete cascade,
  addressee_id uuid not null references public.profiles (id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'accepted')),
  created_at timestamptz not null default now(),
  unique (requester_id, addressee_id)
);
create index if not exists friendships_addressee_idx on public.friendships (addressee_id);
create index if not exists friendships_requester_idx on public.friendships (requester_id);

-- ROW LEVEL SECURITY — cada usuário só acessa o que é seu (ou amizades que o envolvem)
alter table public.profiles enable row level security;
alter table public.mascot_progress enable row level security;
alter table public.mascot_activity_log enable row level security;
alter table public.friendships enable row level security;

drop policy if exists "profiles: leitura pública (busca de amigos)" on public.profiles;
create policy "profiles: leitura pública (busca de amigos)" on public.profiles
  for select using (true);

drop policy if exists "profiles: cada usuário cria/edita só o próprio perfil" on public.profiles;
create policy "profiles: cada usuário cria/edita só o próprio perfil" on public.profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "mascot_progress: só o dono lê/edita" on public.mascot_progress;
create policy "mascot_progress: só o dono lê/edita" on public.mascot_progress
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "mascot_activity_log: só o dono lê/insere" on public.mascot_activity_log;
create policy "mascot_activity_log: só o dono lê/insere" on public.mascot_activity_log
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "friendships: envolvidos leem" on public.friendships;
create policy "friendships: envolvidos leem" on public.friendships
  for select using (auth.uid() = requester_id or auth.uid() = addressee_id);

drop policy if exists "friendships: só quem pede cria o pedido" on public.friendships;
create policy "friendships: só quem pede cria o pedido" on public.friendships
  for insert with check (auth.uid() = requester_id);

drop policy if exists "friendships: envolvidos atualizam (aceitar/recusar)" on public.friendships;
create policy "friendships: envolvidos atualizam (aceitar/recusar)" on public.friendships
  for update using (auth.uid() = requester_id or auth.uid() = addressee_id);

drop policy if exists "friendships: envolvidos removem" on public.friendships;
create policy "friendships: envolvidos removem" on public.friendships
  for delete using (auth.uid() = requester_id or auth.uid() = addressee_id);
