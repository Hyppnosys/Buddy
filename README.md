# Buddy 🦦

Um aplicativo de rotina pessoal: foco (Pomodoro), diário, check-in diário,
respiração, yoga, amigos e uma lontra mascote que evolui com suas atividades —
com contas reais (login/cadastro com validação de e-mail, dados salvos num
banco de dados na nuvem — veja "Banco de dados" abaixo), tema claro/escuro e
um layout com sidebar.

## Como rodar

```bash
npm install
```

**Antes do primeiro `npm run dev`**, configure o banco de dados (Supabase) —
sem isso, login/cadastro/mascote/amigos não funcionam. Veja a seção
"Banco de dados" mais abaixo para o passo a passo completo; resumindo:

```bash
cp .env.example .env.local
# edite .env.local com a URL e a chave do seu projeto Supabase
```

```bash
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
- **Supabase (Postgres + Auth)** para contas, progresso do mascote e amizades
  — sincroniza entre dispositivos (veja "Banco de dados" abaixo)
- `localStorage` só para o que não precisa sincronizar entre dispositivos
  (preferências, diário, check-ins, sessões), isolado por conta de usuário
- **PWA** (`vite-plugin-pwa`) — instalável na tela de início do Android e do
  iPhone, funciona offline depois da primeira visita (veja "App instalável
  (PWA)" abaixo)

## Funcionalidades

**Antes de entrar**
- Tela inicial com a lontra mascote e logo (imagens reais, cor original)
- Login / cadastro com validação de e-mail restrita a provedores conhecidos
  (Gmail, Outlook, Hotmail, Yahoo, iCloud, etc.)

**Depois de entrar** (layout com sidebar)
- **Início** — mascote (só ele, sem figura duplicada), atalho para o check-in
  pendente, e atalhos de sequência (Respiração, Relaxamento, Alongamento,
  Combo Diário)
- **Foco** — timer Pomodoro com ciclos, modo sem distrações
- **Diário** — registro de humor + texto livre, histórico
- **Como você está** — check-in diário (humor, sono, energia, gratidão)
- **Relaxar** — respiração guiada 4-4-4 (Inspira → Segura → Expira, sem
  mascote na tela), yoga com 5 combos diferentes e 3 imagens por postura
  (frente/esquerda/direita), e sons ambientes reais tocando de fundo
- **Sons** — 4 sons ambientes sintetizados (ondas, chuvisco na janela, ruído
  branco, piano — uma pequena melodia ambiente, não notas isoladas) com
  play/pause/volume que realmente funcionam; a seleção feita aqui é o que
  toca durante a respiração e outras atividades de relaxamento
- **Estatísticas** — histórico completo de sessões
- **Amigos** — busca real entre todas as contas cadastradas (qualquer
  dispositivo), com pedido de amizade real: enviar, aceitar, recusar,
  remover — tudo salvo no banco de dados
- **Mascote** — a lontra evolui em marcos (Bebê → Jovem → Adulto) com pontos
  ganhos ao completar check-in, diário, respiração/relaxamento e foco —
  todos alimentam a mesma barra de progresso, salva no banco de dados; nome
  e compartilhamento com amigos são personalizáveis — a aparência (cores
  originais, castanho/laranja) é fixa, sem opção de troca de cor
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
  services/     supabaseClient.ts, mascotDb.ts e friendsDb.ts (banco de
                dados), storage.ts (localStorage local) e notifications.ts
  types/        tipos TypeScript do domínio
  utils/        mascotProgress.ts (lógica pura de fase/barra do mascote),
                formatação de tempo, estatísticas, e-mail, sons, yoga
supabase/
  schema.sql    esquema completo do banco (tabelas, índices, políticas RLS)
public/
  logo-otter.png       logo da lontra (imagem real, cor original laranja/azul —
                        círculo completo, com margem igual nos 4 lados, sem cortes)
  mascot/*.png         3 fases do mascote (imagens reais, cores originais —
                        castanho/laranja/creme, não recoloridas)
```

## Banco de dados

Contas, progresso/fase do mascote e amizades são salvos no
**[Supabase](https://supabase.com)** (Postgres + Auth), gratuito, para que o
progresso do usuário continue o mesmo se ele sair e entrar de novo — inclusive
em outro dispositivo. O restante (diário, check-ins, sessões, preferências)
continua só no navegador, por não precisar sincronizar entre dispositivos.

**Passo a passo para configurar (necessário antes de rodar o app):**

1. Crie um projeto gratuito em [supabase.com](https://supabase.com).
2. No painel do projeto, abra **SQL Editor**, cole o conteúdo de
   `supabase/schema.sql` e rode ("Run"). Isso cria as 4 tabelas, os índices e
   as políticas de segurança (Row Level Security).
3. Em **Authentication → Providers → Email**, **desative "Confirm email"**
   (ela vem ligada por padrão em projetos novos). Sem isso, depois do
   cadastro o app pede para confirmar o e-mail antes de deixar entrar — o que
   funciona, mas muda o comportamento original de "cadastrou, já está
   dentro".
4. Em **Project Settings → API**, copie a **Project URL** e a chave **anon
   public**.
5. Copie `.env.example` para `.env.local` na raiz do projeto e cole os dois
   valores:
   ```
   VITE_SUPABASE_URL=https://SEU-PROJETO.supabase.co
   VITE_SUPABASE_ANON_KEY=SUA-CHAVE-ANON-PUBLIC
   ```
6. Rode `npm run dev` normalmente. Se as variáveis não estiverem
   configuradas, a tela de login mostra um aviso claro em vez de falhar
   silenciosamente.

`.env.local` já está no `.gitignore` (via `*.local`) — a chave anon é segura
de expor no navegador (é assim que o Supabase funciona: a segurança de
verdade vem das políticas RLS no banco, não do segredo da chave), mas mesmo
assim cada pessoa usa o seu próprio projeto/chave.

### Tabelas

| Tabela | Para quê | Campos principais |
| --- | --- | --- |
| `profiles` | Dados do usuário (1-para-1 com a conta de login) | `id`, `name`, `email`, `avatar_data_url`, `bio` |
| `mascot_progress` | Fase, barra da fase atual, pontos extras, XP total | `user_id`, `stage`, `phase_progress`, `extra_points`, `total_xp`, `completed_phases`, `shared_with_friend_ids` |
| `mascot_activity_log` | Histórico de atividades que geraram pontos | `user_id`, `reason`, `points`, `by_name`, `created_at` |
| `friendships` | Pedidos de amizade e amizades aceitas | `requester_id`, `addressee_id`, `status` (`pending`/`accepted`) |

Todas têm Row Level Security ligado: cada usuário só lê/edita as próprias
linhas (perfis são publicamente legíveis, para a busca de amigos funcionar;
amizades só são visíveis para quem participa delas).

### Evolução do mascote (Bebê → Jovem → Adulto)

A lógica de quando evoluir, quando resetar a barra e quando virar pontuação
extra está isolada numa função pura (`applyActivityPoints`, em
`src/utils/mascotProgress.ts`), coberta por 10 testes automatizados — o
`MascotContext` só chama essa função e salva o resultado no banco.

- **Bebê**: barra `0/20`. Ao completar 20, vira **Jovem** e a barra volta
  para `0` (não fica cheia) — pontos que sobrarem da atividade que completou
  a barra são aproveitados na barra nova, não descartados.
- **Jovem**: barra `0/40`. Ao completar 40, vira **Adulto** e a barra volta
  para `0` de novo.
- **Adulto**: não evolui mais. A partir daí, cada ponto ganho vira
  "pontuação extra" (`extra_points`), que só acumula, sem limite.
- Um **XP total** (`total_xp`) separado nunca reseta — é o histórico
  vitalício, mostrado como "pontos de cuidado no total" na tela do mascote.
- Todo usuário novo começa obrigatoriamente como Bebê, barra em 0 (linha
  criada no cadastro, em `AuthContext.signUp`).

**Nota sobre os 3 marcos pedidos (20 / 60 / 80):** o pedido descreve 3
marcos — 20 → Jovem, 60 → Adulto, 80 → "Adulto completamente evoluído" — mas
o mascote só tem 3 fases com arte própria (Bebê/Jovem/Adulto); criar uma 4ª
fase visual para o marco de 80 exigiria nova ilustração, fora do escopo
combinado (o pedido também dizia para não alterar a evolução visual do
mascote). Por isso os marcos foram implementados como **metas por fase** — 20
pontos para completar a barra do Bebê, 40 pontos para completar a barra do
Jovem (equivalente a "60 no total" da rodada anterior) — e o marco de 80 virou
o ponto em que a "pontuação extra" do Adulto começa a contar história (não
existe um 4º estado visual). Se preferir outro número aí, ou uma 4ª fase de
verdade (precisaria de uma nova imagem), é só pedir.

### Amizades

Busca (`profiles`, por nome ou e-mail), pedido de amizade
(`friendships` com `status = 'pending'`), aceitar (`status = 'accepted'`),
recusar/remover (apaga a linha) e listar amigos — tudo via
`src/services/friendsDb.ts` e `src/context/FriendsContext.tsx`. A tela de
Amigos ganhou uma seção nova de "Pedidos recebidos"/"Pedidos enviados" para
esse fluxo (antes, "adicionar" conectava direto, sem pedido).

## App instalável (PWA)

O Buddy é um **PWA** (Progressive Web App): o mesmo site pode ser "instalado"
na tela de início do celular (Android ou iPhone), abre em tela cheia (sem a
barra do navegador) e continua funcionando mesmo sem internet depois da
primeira visita — sem precisar de loja de aplicativos nem conta de
desenvolvedor.

### Como instalar

**Android (Chrome):** abra o site publicado no Chrome. Ou aparece
automaticamente um banner "Adicionar Buddy à tela inicial", ou vá no menu
"⋮" → **"Instalar app"** / **"Adicionar à tela inicial"**.

**iPhone (Safari — precisa ser o Safari, outros navegadores no iOS não
oferecem essa opção):** abra o site no Safari, toque no ícone de
compartilhar (o quadrado com a seta para cima) e escolha **"Adicionar à
Tela de Início"**.

Depois de instalado, o Buddy aparece como um ícone normal, junto dos outros
apps do celular.

### Como funciona por baixo dos panos

- `vite-plugin-pwa` (`vite.config.ts`) gera, no build de produção, um
  `manifest.webmanifest` (nome, ícones, cor do tema, `display: standalone`)
  e um service worker (`sw.js`) que guarda em cache os arquivos do app
  (HTML/CSS/JS/ícones) — é isso que permite abrir instantaneamente e
  funcionar offline. Chamadas ao Supabase **não** ficam em cache — sempre
  vão para a rede normalmente, como antes; só os arquivos do próprio app são
  servidos localmente.
- **Atualização:** uma nova versão publicada é baixada em segundo plano
  automaticamente, mas **não troca sozinha** enquanto a pessoa está com o
  app aberto (pra não misturar código antigo com novo no meio do uso). Em
  vez disso, aparece uma barrinha no rodapé — **"Nova versão disponível ·
  Atualizar"** (`src/components/PwaUpdatePrompt.tsx`) — e só troca quando a
  pessoa toca nela. Sem tocar, ela continua na versão atual até fechar e
  abrir o app de novo (aí a versão nova já entra sozinha).
- Precisa de HTTPS pra funcionar como PWA de verdade (funciona em
  `localhost` durante o desenvolvimento também) — o domínio do Vercel já
  atende isso automaticamente, nenhuma configuração extra é necessária lá.
- No próprio `npm run dev`, o service worker também é ativado (modo de
  desenvolvimento do plugin), então dá pra testar o fluxo de instalação
  localmente, sem precisar de build/deploy.

### Isso NÃO é um app nativo publicado nas lojas

PWA é instalável e parece um app, mas não aparece na Google Play nem na App
Store, e alguns recursos do celular (notificações push "de verdade" no
iPhone, por exemplo) ficam mais limitados que num app nativo. Se no futuro
quiserem publicar nas lojas oficiais, dá pra reaproveitar esse mesmo código
com o Capacitor (empacota o app React como Android/iOS "de verdade") — nesse
caso a build de iOS vai exigir um Mac com Xcode, e contas de desenvolvedor
pagas na Google e na Apple.

## Decisões técnicas

- **Mascote com imagens reais e cores originais:** as 3 fases ("bebê",
  "jovem", "adulto") usam ilustrações reais recortadas diretamente da arte
  de referência, sem qualquer recoloração — permanecem castanho/laranja/creme.
  A logo (a lontrinha redonda no menu/topo) é uma peça separada, na sua cor
  original (laranja/azul); os dois nunca compartilham estado ou lógica de
  cor. Não existe mais personalização de cor do mascote em nenhum lugar do
  código (removida por completo: sem seletor, botão, estado ou variável).
- **3 fases, não 4:** havia uma fase extra ("ovo"/recém-nascido) que
  reutilizava a mesma imagem da fase "bebê" — cruzar esse limiar de XP não
  mudava nada visualmente, o que fazia a evolução parecer quebrada. Ela foi
  removida; agora toda transição de fase troca a imagem exibida.
- **Pontuação centralizada:** `MascotContext.addActivity(razão, pontos)` é o
  único lugar que altera os pontos do mascote (e o único que grava no banco
  de dados). Check-in (+3, uma vez por dia), Diário (+2, por registro),
  Respiração/Relaxamento (+3, só ao completar um ciclo/rotina inteira) e
  Foco (+5, só ao concluir uma sessão Pomodoro) todos chamam essa mesma
  função — nenhuma tela mantém seu próprio contador separado. Cada chamada é
  guardada contra duplicidade (ex.: um `ref` que impede creditar de novo
  antes de reiniciar a atividade).
- **Marcos de progresso (Bebê 0/20 → Jovem 0/40 → Adulto):** ver a seção
  "Banco de dados" mais acima — a barra agora reseta a cada evolução em vez
  de ser um XP acumulado fixo (`src/utils/mascotProgress.ts`).
- **Logo circular sem cortes, cor original:** o arquivo
  `public/logo-otter.png` foi recortado de novo a partir da arte de
  referência original, com margem transparente igual nos 4 lados (o círculo
  já vinha meio colado na borda, então a máscara CSS `rounded-full` acabava
  cortando o desenho), e o `Logo.tsx` trocou `object-cover` por
  `object-contain` — essa era a causa raiz do ícone aparecer
  "cortado"/quadrado. O formato/resolução ficaram assim definitivos; a cor
  em si foi revertida para a paleta original (laranja/azul) da arte de
  referência a pedido do usuário — a recoloração para verde foi descartada.
  Também foram gerados `favicon.ico` (multi-resolução), `apple-touch-icon.png`
  e `icon-192.png`/`icon-512.png` — hoje usados também como ícones do PWA
  (ver seção "App instalável (PWA)" abaixo).
- **Respiração 4-4-4, determinística por tempo real:** o hook
  `useBreathingExercise` calcula a fase ativa a partir do tempo decorrido
  (`performance.now()`) módulo a duração total do ciclo (12s: 4+4+4), em vez
  de incrementar um índice a cada `setInterval` — isso garante que a ordem
  Inspira → Segura → Expira (na ordem exata do array `phases` em
  `Relax.tsx`) nunca desincroniza do texto, da animação ou do áudio.
- **Sons ambientes reais:** como não há arquivos de áudio externos disponíveis
  neste ambiente (nem é possível buscá-los pela rede), os 4 sons da aba
  "Sons" (`src/utils/ambientSoundEngine.ts`) são sintetizados ao vivo com a
  Web Audio API — ruído filtrado, osciladores e LFOs — e tocam em loop de
  verdade, com play/pause/volume/troca de som funcionando. A seleção fica
  centralizada em `settings.sound` e um único componente
  (`<AmbientSoundEngine />`, montado uma vez em `AppLayout`) mantém a
  reprodução sincronizada com essa seleção em qualquer tela, incluindo a
  respiração — nenhuma tela tem um som fixo próprio. Ondas, Chuvisco na
  janela e Ruído branco não foram tocados nesta rodada (mantidos exatamente
  como estavam, a pedido do usuário). Floresta, Passarinhos e Árvores ao
  vento foram removidos por completo — código, referências e ícones que só
  eram usados por eles (`Bird`, `Trees`, `TreePine`, `Flame` em
  `SoundPlayer.tsx`) — já que não sobrava nenhum outro uso desses sons no
  app. O Piano deixou de tocar notas isoladas aleatórias e agora toca uma
  pequena melodia ambiente fixa que se repete em loop: uma frase calma em
  dó maior pentatônico, ritmo lento (~46 bpm), ataque suave e cauda longa
  em cada nota (dois osciladores levemente destacados por voz, sem
  batidas/percussão), mais um pad grave bem baixo por baixo para dar corpo
  — soa como uma pequena música de fundo, não como um som isolado de piano.
- **PWA sem tocar no resto do app:** a instalabilidade/offline vêm inteiramente
  de configuração (`vite-plugin-pwa` em `vite.config.ts` + tags de `<head>`
  em `index.html`) e de um componente novo e isolado
  (`PwaUpdatePrompt.tsx`) — nenhuma tela, rota, contexto ou lógica existente
  foi alterada para viabilizar isso. Ver seção "App instalável (PWA)" acima.
