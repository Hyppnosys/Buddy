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
- **Início** — mascote (só ele, sem figura duplicada), atalho para o check-in
  pendente, e atalhos de sequência (Respiração, Relaxamento, Alongamento,
  Combo Diário)
- **Foco** — timer Pomodoro com ciclos, modo sem distrações
- **Diário** — registro de humor + texto livre, histórico
- **Como você está** — check-in diário (humor, sono, energia, gratidão)
- **Relaxar** — respiração guiada (Inspira → Segura → Expira, sem mascote na
  tela), yoga com 5 combos diferentes e 3 imagens por postura
  (frente/esquerda/direita), e sons ambientes reais tocando de fundo
- **Sons** — 5 sons ambientes sintetizados (chuva, floresta, ondas, ruído
  branco, ambiente calmo) com play/pause/volume que realmente funcionam; a
  seleção feita aqui é o que toca durante a respiração e outras atividades
  de relaxamento
- **Estatísticas** — histórico completo de sessões
- **Amigos** — busca real entre as contas cadastradas no dispositivo
- **Mascote** — a lontra evolui (recém-nascido → filhote → jovem → adulto)
  com pontos ganhos ao completar atividades; nome e compartilhamento com
  amigos são personalizáveis — a aparência (cor) é fixa, sem opção de troca
- **Perfil** — nome, foto (upload real), bio, logout
- **Configurações** — timer, sons, tema, notificações, modo sem distrações

## Estrutura

```
src/
  components/   componentes de UI reutilizáveis
  pages/        Landing, Login, Dashboard, Foco, Journal, CheckIn, Relax,
                Statistics, Friends, Mascot, Profile, Settings
  hooks/        useAuth, useTimer, useSessions, useJournal, useCheckIns,
                useFriends, useMascot, useSettings, useTheme, useBreathingExercise...
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
  app, sempre com a mesma cor fixa — não há personalização de cor pelo
  usuário.
- **Respiração determinística por tempo real:** o hook `useBreathingExercise`
  calcula a fase ativa a partir do tempo decorrido (`performance.now()`)
  módulo a duração total do ciclo, em vez de incrementar um índice a cada
  `setInterval` — isso garante que a ordem Inspira → Segura → Expira (na
  ordem exata do array `phases` em `Relax.tsx`) nunca desincroniza do texto,
  da animação ou do áudio.
- **Sons ambientes reais:** como não há arquivos de áudio externos disponíveis
  neste ambiente (nem é possível buscá-los pela rede), os 5 sons da aba
  "Sons" (`src/utils/ambientSoundEngine.ts`) são sintetizados ao vivo com a
  Web Audio API — ruído filtrado, osciladores e LFOs — e tocam em loop de
  verdade, com play/pause/volume/troca de som funcionando. A seleção fica
  centralizada em `settings.sound` e um único componente
  (`<AmbientSoundEngine />`, montado uma vez em `AppLayout`) mantém a
  reprodução sincronizada com essa seleção em qualquer tela, incluindo a
  respiração — nenhuma tela tem um som fixo próprio.
