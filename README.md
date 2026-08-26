# Buddy 🌿

Um aplicativo de rotina pessoal: foco (Pomodoro), diário, check-in diário,
respiração, yoga, amigos e um mascote que evolui com suas atividades — tudo
com contas locais (login/cadastro), tema claro/escuro e um layout com sidebar.

## Como rodar

```bash
npm install
npm run dev
```

Abra o endereço mostrado no terminal (normalmente `http://localhost:5173`).

## Scripts disponíveis

| Comando | O que faz |
| --- | --- |
| `npm run dev` | Inicia o servidor de desenvolvimento |
| `npm run build` | Gera a versão de produção em `dist/` |
| `npm run preview` | Serve a build de produção localmente |
| `npm run test` | Roda os testes automatizados (Vitest) |
| `npm run lint` | Roda o linter |

## Stack

- React 19 + TypeScript + Vite
- Tailwind CSS v4 (tokens de design via `@theme`, suporte a modo claro/escuro)
- React Router (rotas públicas `/`, `/login`; área logada em `/app/*`)
- Vitest + Testing Library para testes
- Persistência via `localStorage`, com dados isolados por conta de usuário

## Funcionalidades

**Antes de entrar**
- Tela inicial (landing) com mascote ilustrado
- Login / cadastro (contas salvas neste dispositivo/navegador)

**Depois de entrar** (layout com sidebar)
- **Painel** — estatísticas do dia, atalhos rápidos e o mascote (pode ser ocultado)
- **Foco** — timer Pomodoro com ciclos, ✕ modo sem distrações
- **Diário** — registro de humor + texto livre, histórico
- **Como você está** — check-in diário (humor, sono, energia, gratidão)
- **Relaxar** — respiração guiada, rotina de yoga com 7 posturas, sons ambientes
- **Estatísticas** — visão completa do progresso e histórico de sessões
- **Amigos** — conexões locais para acompanhar a rotina em conjunto
- **Mascote** — evolui (ovo → filhote → jovem → adulto) com pontos ganhos ao
  completar foco, diário, check-in e yoga; pode ser renomeado, recolorido e
  compartilhado com amigos
- **Perfil** — nome, foto (upload real), bio, logout
- **Configurações** — timer, sons, tema, notificações, modo sem distrações,
  limpar dados

## Estrutura

```
src/
  components/   componentes de UI reutilizáveis (Sidebar, MascotAvatar, YogaSession...)
  pages/        Landing, Login, Dashboard, Foco, Journal, CheckIn, Relax,
                Statistics, Friends, Mascot, Profile, Settings
  hooks/        useAuth, useTimer, useSessions, useJournal, useCheckIns,
                useFriends, useMascot, useSettings, useTheme...
  context/      Providers: Auth, Settings, Sessions, Journal, CheckIns,
                Friends, Mascot, Toast
  services/     storage.ts (localStorage) e notifications.ts (Notification API)
  types/        tipos TypeScript do domínio
  utils/        formatação de tempo, estatísticas, sequência, rotina de yoga
```

## Decisões técnicas

- **Contas locais (mock):** não há backend. Cadastro/login funcionam de
  verdade, mas os dados (usuários, senha em texto simples) ficam só no
  navegador do dispositivo. Não é uma autenticação segura para produção —
  serve para demonstrar o fluxo completo e já deixa a estrutura pronta para
  trocar por um backend real (a leitura/escrita passa toda por
  `services/storage.ts`).
- **Dados isolados por usuário:** sessões, diário, check-ins, amigos e
  mascote são gravados com uma chave por conta, então trocar de usuário no
  mesmo navegador nunca mistura dados de rotinas diferentes.
- **Timer preciso:** o cronômetro usa um timestamp de término em vez de só
  contar `setInterval`, então o tempo permanece correto mesmo em segundo plano.
- **Mascote compartilhado:** como não há servidor, "compartilhar" com amigos é
  simulado localmente (marca quem participa e aparece no histórico de
  cuidados). Uma sincronização real entre contas diferentes exigiria backend.

## O que ainda não está incluído

- Um backend real (API + banco de dados) — a arquitetura permite adicionar
  quando for necessário, sem reescrever a interface.
- Arquivos de áudio reais para os sons ambientes (estrutura já pronta).
- Sincronização de dados entre dispositivos/contas diferentes.
