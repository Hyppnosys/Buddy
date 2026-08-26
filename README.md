# Foco & Relax 🌿

Um aplicativo de produtividade e bem-estar: sessões de foco (técnica Pomodoro), pausas curtas e longas, estatísticas, sequência de dias e uma área de relaxamento com exercício de respiração e sons ambientes.

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
- React Router (rotas `/`, `/stats`, `/relax`, `/settings`)
- Vitest + Testing Library para testes
- Persistência via `localStorage` (nenhum backend é necessário para as funcionalidades atuais)

## Estrutura

```
src/
  components/   componentes de UI reutilizáveis
  pages/        Home, Statistics, Relax, Settings
  hooks/        useTimer, useSessions, useSettings, useTheme, useBreathingExercise...
  context/      Providers de settings, sessões e toasts (fonte única de estado)
  services/     storage.ts (localStorage) e notifications.ts (Notification API)
  types/        tipos TypeScript do domínio
  utils/        formatação de tempo, cálculo de estatísticas e sequência
```

## Decisões técnicas

- **Timer preciso:** o cronômetro usa um timestamp de término (`endTimestamp`) em vez de apenas contar `setInterval`, então o tempo permanece correto mesmo se a aba ficar em segundo plano.
- **Nunca dois timers ao mesmo tempo:** `start()` é um no-op se já houver uma sessão em execução.
- **Arquitetura pronta para backend:** toda leitura/escrita de dados passa por `services/storage.ts`. Trocar `localStorage` por chamadas REST (Node + PostgreSQL + Drizzle, como planejado) significa alterar apenas esse arquivo.
- **Estado global via Context:** `SettingsContext` e `SessionsContext` evitam que múltiplas instâncias de `localStorage` fiquem dessincronizadas entre componentes.

## O que ainda não está incluído

- Arquivos de áudio reais para os sons ambientes (a estrutura em `utils/sounds.ts` e `components/SoundPlayer.tsx` já está pronta para recebê-los).
- Um backend real — a arquitetura permite adicionar quando for necessário.
