# Buddy 🦦

Um aplicativo de rotina pessoal: foco (Pomodoro), diário, check-in diário,
respiração, yoga, amigos e uma lontra mascote que evolui com suas atividades —
com contas locais (login/cadastro com validação de e-mail), tema claro/escuro
e um layout com sidebar.

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
- Tela inicial com a lontra mascote e logo (imagens reais, recoloridas em verde)
- Login / cadastro com validação de e-mail restrita a provedores conhecidos
  (Gmail, Outlook, Hotmail, Yahoo, iCloud, etc.)

**Depois de entrar** (layout com sidebar)
- **Início** — pessoa + mascote lado a lado, atalho para o check-in pendente,
  e atalhos de sequência (Respiração, Relaxamento, Alongamento, Combo Diário)
- **Foco** — timer Pomodoro com ciclos, modo sem distrações
- **Diário** — registro de humor + texto livre, histórico
- **Como você está** — check-in diário (humor, sono, energia, gratidão)
- **Relaxar** — respiração guiada (com som real via Web Audio API), yoga com
  5 combos diferentes e 3 imagens por postura (frente/esquerda/direita), sons
  ambientes
- **Estatísticas** — histórico completo de sessões
- **Amigos** — busca real entre as contas cadastradas no dispositivo
- **Mascote** — a lontra evolui (recém-nascido → filhote → jovem → adulto)
  com pontos ganhos ao completar atividades; nome, cor e compartilhamento
  personalizáveis
- **Perfil** — nome, foto (upload real), bio, logout
- **Configurações** — timer, sons, tema, notificações, modo sem distrações

## Estrutura

```
src/
  components/   componentes de UI reutilizáveis
  pages/        Landing, Login, Dashboard, Foco, Journal, CheckIn, Relax,
                Statistics, Friends, Mascot, Profile, Settings
  hooks/        useAuth, useTimer, useSessions, useJournal, useCheckIns,
                useFriends, useMascot, useSettings, useTheme, useBreathingSound...
  context/      Providers: Auth, Settings, Sessions, Journal, CheckIns,
                Friends, Mascot, Toast
  services/     storage.ts (localStorage) e notifications.ts (Notification API)
  types/        tipos TypeScript do domínio
  utils/        formatação de tempo, estatísticas, e-mail, sons, yoga
public/
  logo-otter.png       logo da lontra (imagem real, recolorida em verde)
  mascot/*.png         3 fases do mascote (imagens reais, recoloridas em verde)
```

## Decisões técnicas

- **Contas locais (mock):** não há backend. Cadastro/login funcionam de
  verdade — incluindo validação de e-mail e busca real de outros usuários
  cadastrados — mas os dados ficam só no navegador do dispositivo.
- **Mascote com imagens reais:** as fases "filhote", "jovem" e "adulto" usam
  ilustrações reais (não SVG desenhado à mão), recoloridas para o verde do
  app. A cor do mascote pode ser trocada pelo usuário — isso é feito via
  filtro CSS `hue-rotate` aplicado à imagem, calculado dinamicamente a
  partir da cor escolhida.
- **Som da respiração:** gerado ao vivo com a Web Audio API (tom que sobe na
  inspiração e desce na expiração) — funciona de verdade, iniciado sempre
  dentro do gesto de clique do usuário (para não ser bloqueado pelo navegador).
