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
- **Relaxar** — respiração guiada 4-4-4 (Inspira → Segura → Expira, sem
  mascote na tela), yoga com 5 combos diferentes e 3 imagens por postura
  (frente/esquerda/direita), e sons ambientes reais tocando de fundo
- **Sons** — 5 sons ambientes sintetizados (chuva leve, floresta, ondas,
  lareira, ambiente calmo) com play/pause/volume que realmente funcionam; a
  seleção feita aqui é o que toca durante a respiração e outras atividades
  de relaxamento
- **Estatísticas** — histórico completo de sessões
- **Amigos** — busca real entre as contas cadastradas no dispositivo
- **Mascote** — a lontra evolui (bebê → jovem → adulto) com pontos ganhos ao
  completar check-in, diário, respiração/relaxamento e foco — todos
  alimentam o mesmo XP central; nome e compartilhamento com amigos são
  personalizáveis — a aparência (cores originais, castanho/laranja) é fixa,
  sem opção de troca de cor
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
  logo-otter.png       logo da lontra (imagem real, recolorida em verde — círculo
                        completo, com margem igual nos 4 lados, sem cortes)
  mascot/*.png         3 fases do mascote (imagens reais, cores originais —
                        castanho/laranja/creme, não recoloridas)
```

## Decisões técnicas

- **Contas locais (mock):** não há backend. Cadastro/login funcionam de
  verdade — incluindo validação de e-mail e busca real de outros usuários
  cadastrados — mas os dados ficam só no navegador do dispositivo.
- **Mascote com imagens reais e cores originais:** as 3 fases ("bebê",
  "jovem", "adulto") usam ilustrações reais recortadas diretamente da arte
  de referência, sem qualquer recoloração — permanecem castanho/laranja/creme.
  A logo (a lontrinha redonda no menu/topo) é uma peça separada e é a única
  coisa recolorida para verde; os dois nunca compartilham estado ou lógica de
  cor. Não existe mais personalização de cor do mascote em nenhum lugar do
  código (removida por completo: sem seletor, botão, estado ou variável).
- **3 fases, não 4:** havia uma fase extra ("ovo"/recém-nascido) que
  reutilizava a mesma imagem da fase "bebê" — cruzar esse limiar de XP não
  mudava nada visualmente, o que fazia a evolução parecer quebrada. Ela foi
  removida; agora toda transição de fase troca a imagem exibida.
- **Pontuação centralizada:** `MascotContext.addActivity(razão, pontos)` é o
  único lugar que altera o XP do mascote. Check-in (+3, uma vez por dia),
  Diário (+2, por registro), Respiração/Relaxamento (+3, só ao completar um
  ciclo/rotina inteira) e Foco (+5, só ao concluir uma sessão Pomodoro) todos
  chamam essa mesma função — nenhuma tela mantém seu próprio contador
  separado. Cada chamada é guardada contra duplicidade (ex.: um `ref` que
  impede creditar de novo antes de reiniciar a atividade).
- **Logo circular sem cortes:** o arquivo `public/logo-otter.png` foi
  recortado de novo a partir da arte de referência original, com margem
  transparente igual nos 4 lados (o círculo já vinha meio colado na borda,
  então a máscara CSS `rounded-full` acabava cortando o desenho). O
  `Logo.tsx` também trocou `object-cover` por `object-contain`, que era a
  causa raiz de o ícone aparecer "cortado"/quadrado — `cover` estica a
  imagem para preencher o quadrado e deixa a máscara circular do CSS cortar
  o que sobra. Também foram gerados `favicon.ico` (multi-resolução),
  `apple-touch-icon.png`, `icon-192.png`/`icon-512.png` e um
  `site.webmanifest` com `purpose: "any"`, para o ícone ficar nítido em
  qualquer tamanho que o navegador/SO peça.
- **Respiração 4-4-4, determinística por tempo real:** o hook
  `useBreathingExercise` calcula a fase ativa a partir do tempo decorrido
  (`performance.now()`) módulo a duração total do ciclo (12s: 4+4+4), em vez
  de incrementar um índice a cada `setInterval` — isso garante que a ordem
  Inspira → Segura → Expira (na ordem exata do array `phases` em
  `Relax.tsx`) nunca desincroniza do texto, da animação ou do áudio.
- **Sons ambientes reais:** como não há arquivos de áudio externos disponíveis
  neste ambiente (nem é possível buscá-los pela rede), os 5 sons da aba
  "Sons" (`src/utils/ambientSoundEngine.ts`) são sintetizados ao vivo com a
  Web Audio API — ruído filtrado, osciladores e LFOs — e tocam em loop de
  verdade, com play/pause/volume/troca de som funcionando. A seleção fica
  centralizada em `settings.sound` e um único componente
  (`<AmbientSoundEngine />`, montado uma vez em `AppLayout`) mantém a
  reprodução sincronizada com essa seleção em qualquer tela, incluindo a
  respiração — nenhuma tela tem um som fixo próprio. Floresta e Ambiente
  calmo não foram alterados; a Chuva foi suavizada (banda mais estreita,
  volume menor, sem o rumor grave que fazia parecer tempestade); o antigo
  "Ruído branco" — que soava quase igual à chuva — foi substituído por
  "Lareira", com uma textura claramente diferente (rumor grave baixinho +
  estalos esparsos de lenha, sem nenhum chiado contínuo).
