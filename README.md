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
- Tela inicial (landing) com a lontra mascote ilustrada e logo verde
- Login / cadastro com validação de e-mail (aceita qualquer provedor: Gmail,
  Hotmail, Yahoo, Outlook, etc.)

**Depois de entrar** (layout com sidebar)
- **Início** — pessoa + mascote lontra lado a lado, atalho para o check-in
  pendente, e "Escolha uma sequência" (Respiração, Relaxamento, Alongamento,
  Combo Diário) — tela propositalmente enxuta, sem gráficos ou estatísticas
- **Foco** — timer Pomodoro com ciclos, modo sem distrações
- **Diário** — registro de humor + texto livre, histórico
- **Como você está** — check-in diário (humor, sono, energia, gratidão)
- **Relaxar** — três abas:
  - *Respiração*: sequência Inspira → Segura → Expira com indicação visual
    clara, mascote animado, e som real (gerado via Web Audio API, sem
    depender de arquivos externos) com botão liga/desliga logo abaixo
  - *Exercitar*: 5 combos de posturas (Fluxo suave, Alongamento rápido,
    Energia matinal, Relaxamento noturno, Combo diário), cada postura com
    3 ilustrações (frente, esquerda, direita)
  - *Sons*: sons ambientes com volume
- **Estatísticas** — visão completa do progresso e histórico de sessões
- **Amigos** — busca real entre as contas cadastradas (por nome ou e-mail),
  com estados de carregamento/vazio, e lista de conexões
- **Mascote** — a lontra evolui (recém-nascido → filhote → jovem → adulto)
  com pontos ganhos ao completar foco, diário, check-in, respiração e yoga;
  pode ser renomeada, recolorida e compartilhada com amigos
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
  verdade — incluindo validação de e-mail e busca real de outros usuários
  cadastrados — mas os dados (usuários, senha em texto simples) ficam só no
  navegador do dispositivo. Não é uma autenticação segura para produção —
  serve para demonstrar o fluxo completo e já deixa a estrutura pronta para
  trocar por um backend real (a leitura/escrita passa toda por
  `services/storage.ts`).
- **Busca de amigos com dados reais:** como todas as contas criadas no mesmo
  navegador compartilham a mesma lista de usuários, criar duas contas nesse
  navegador e buscar uma pela outra funciona de verdade — não é uma lista
  fixa. Uma busca entre dispositivos diferentes exigiria um backend.
- **Som da respiração:** gerado ao vivo com a Web Audio API (um tom que sobe
  durante a inspiração e desce durante a expiração) — não depende de nenhum
  arquivo de áudio, então funciona imediatamente sem precisar adicionar assets.
- **Ilustrações de postura:** são desenhos simples tipo "boneco palito" em
  SVG, não fotos — mantém o app leve e a identidade visual consistente.
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
