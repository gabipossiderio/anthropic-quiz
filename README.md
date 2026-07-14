# anthropic-quiz — CCA-F Hunt

Jogo educativo web (quiz de tabuleiro + tiro ao alvo) para estudar
para a certificação **Claude Certified Architect (CCA-F)** da Anthropic.

Escolha um número no tabuleiro, responda a pergunta e, se acertar, jogue o
mini-game de tiro nos "inimigos do dev" (bug, erro 500, merge conflict) para
conquistar os pontos.

## Stack

- **client** — React + TypeScript + Vite + Tailwind v4
- **estilo** — pixel art 8-bit, fontes Press Start 2P / Pixelify Sans, áudio
  sintetizado (Web Audio), animações em CSS keyframes
- **serverless (opcional)** — funções em `client/api/` (Vercel):
  - `api/analise` — análise de estudo por IA (Google Gemini)
  - `api/ranking` — ranking persistente (Upstash Redis)

O jogo funciona 100% offline. As funções serverless só são necessárias para a
**análise com IA** e o **ranking online** — sem elas, o app cai num fallback
gracioso (relatório offline em .md/PDF e mensagem de "ranking após deploy").

## Rodar local

```bash
pnpm install
pnpm dev
```

- Client: http://localhost:5173

> No `pnpm dev` as rotas `/api/*` não existem (o Vite não roda as funções), então
> o ranking e a IA mostram o fallback. Para testar as funções localmente use
> `vercel dev` (Vercel CLI) com as variáveis de ambiente configuradas.

## Deploy (Vercel)

1. Importe o repositório na Vercel e defina **Root Directory = `client`**
   (a Vercel detecta o Vite e serve a pasta `client/api` em `/api/*`).
2. Configure as variáveis de ambiente (Project → Settings → Environment
   Variables):

| Variável                    | Usada por     | Obrigatória | Descrição                                   |
| --------------------------- | ------------- | ----------- | ------------------------------------------- |
| `GEMINI_API_KEY`            | `api/analise` | p/ IA       | Chave do Google AI Studio (Gemini)          |
| `GEMINI_MODEL`              | `api/analise` | não         | Modelo Gemini (default `gemini-2.0-flash`)  |
| `UPSTASH_REDIS_REST_URL`    | `api/ranking` | p/ ranking  | REST URL do banco Upstash Redis             |
| `UPSTASH_REDIS_REST_TOKEN`  | `api/ranking` | p/ ranking  | REST token do banco Upstash Redis           |

3. Deploy. O ranking usa um sorted set (`cca-leaderboard`) e mantém o top 100.

### Onde pegar as chaves (grátis)

- **Gemini**: https://aistudio.google.com/app/apikey (free tier)
- **Upstash Redis**: https://console.upstash.com — crie um banco Redis e copie
  o `UPSTASH_REDIS_REST_URL` e o `UPSTASH_REDIS_REST_TOKEN`

## Estrutura

```
client/
├── api/
│   ├── analysis.ts       Serverless: análise de estudo (Gemini)
│   └── ranking.ts        Serverless: ranking (Upstash Redis)
└── src/
    ├── data/
    │   ├── categories.ts   Domínios, times, config
    │   ├── questions.ts    60 perguntas reais (4 domínios)
    │   ├── translations.ts Traduções PT das 60 perguntas
    │   └── studyTips.ts    Dicas de estudo por domínio (PT/EN)
    ├── game/
    │   ├── types.ts, useQuizGame.ts   Estado do jogo
    │   ├── audio.ts        Sons e música (Web Audio)
    │   ├── report.ts       Relatório .md/PDF + prompt p/ Claude (PT/EN)
    │   ├── ai.ts           Client → /api/analysis
    │   └── ranking.ts      Client → /api/ranking
    ├── i18n.tsx            PT/EN
    └── components/         Board, QuestionModal, TargetShooter, etc.
```

## Créditos

Feito por [Gabriella Possidério](https://www.linkedin.com/in/gabriella-possiderio/).
