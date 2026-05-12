# AI News Aggregator

A full-stack TypeScript application that automatically scrapes AI news from multiple sources, uses an LLM to summarize and categorize every article, and delivers a personalized daily feed to each user based on their topic preferences.

---

## What it does

AI moves fast. New models, papers, products, and policy decisions drop daily across dozens of sources. This product scrapes them automatically, summarizes each article using an LLM, and surfaces only what's relevant to you — filtered by topic and technical depth.

- Scrapes HackerNews, ArXiv, and TechCrunch every 12 hours
- Sends each new article through Groq (Llama 3.3 70B) for summarization and tagging
- Serves a live filterable feed with personalized topic and depth filters
- Sends a daily email digest of your top 10 articles

---

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React + Vite + TypeScript |
| Backend | Node.js + Express + TypeScript |
| Database | Supabase (Postgres) |
| ORM | Prisma |
| Auth | Supabase Auth (JWT) |
| LLM | Groq — Llama 3.3 70B |
| Email | Resend + React Email |
| Scheduling | node-cron |
| Monorepo | pnpm workspaces |
| Hosting | Railway (API) + Vercel (Frontend) |
| Secrets | Doppler |

---

## Project structure

```
ai-news-aggregator/
├── apps/
│   ├── api/                        # Express backend
│   │   ├── src/
│   │   │   ├── lib/
│   │   │   │   ├── db.ts           # Prisma client
│   │   │   │   ├── logger.ts       # Pino structured logger
│   │   │   │   ├── supabase.ts     # Supabase admin client
│   │   │   │   └── scheduler.ts    # node-cron job scheduler
│   │   │   ├── middleware/
│   │   │   │   ├── auth.middleware.ts    # JWT verification
│   │   │   │   └── error.middleware.ts  # Global error handler
│   │   │   ├── routes/
│   │   │   │   ├── health.routes.ts
│   │   │   │   ├── auth.routes.ts
│   │   │   │   ├── articles.routes.ts
│   │   │   │   └── preferences.routes.ts
│   │   │   ├── services/
│   │   │   │   ├── llm.service.ts       # Groq integration
│   │   │   │   ├── pipeline.service.ts  # Orchestrates scraping + LLM
│   │   │   │   └── scrapers/
│   │   │   │       ├── hackernews.scraper.ts
│   │   │   │       ├── arxiv.scraper.ts
│   │   │   │       └── venturebeat.scraper.ts
│   │   │   └── index.ts
│   │   ├── prisma/
│   │   │   └── schema.prisma
│   │   └── Dockerfile
│   └── web/                        # React frontend
│       └── src/
│           ├── components/
│           │   └── ProtectedRoute.tsx
│           ├── lib/
│           │   ├── api.ts          # Axios instance with auth interceptor
│           │   └── supabase.ts     # Supabase client
│           ├── pages/
│           │   ├── LoginPage.tsx
│           │   ├── SignupPage.tsx
│           │   ├── AuthCallbackPage.tsx
│           │   ├── OnboardingPage.tsx
│           │   ├── FeedPage.tsx
│           │   └── SettingsPage.tsx
│           └── store/
│               └── auth.store.ts   # Zustand auth state
└── packages/
    └── shared/                     # Shared TypeScript types
        └── src/
            └── types/
```

---

## How the pipeline works

```
Every 12 hours:
  node-cron triggers pipeline.service.ts
      │
      ├── scrapeHackerNews()   — top 50 HN stories, filtered for AI keywords
      ├── scrapeArxiv()        — 30 latest cs.AI / cs.LG / cs.CL papers
      └── scrapeTechCrunch()   — 15 latest articles from /category/ai/
      │
      ▼
  Dedup check against DB (skip if URL already exists)
      │
      ▼
  analyzeArticle() — sends to Groq, gets back:
      │   • summary (2-3 sentences, technically accurate)
      │   • tags[]  (from fixed taxonomy)
      │   • technicalDepth (1-5 integer)
      ▼
  Article saved to Postgres with processedAt timestamp
      │
      ▼
  Available on the feed immediately
```

---

## Data model

```prisma
User
  └── UserPreferences (topics[], minTechnicalDepth, digestFrequency)
  └── Digest[]
        └── DigestArticle[] → Article

Article
  title, url, source, summary, tags[], technicalDepth, publishedAt, processedAt
```

---

## API endpoints

```
GET  /health                    — health check (used by uptime monitor)

POST /auth/logout               — invalidate session
GET  /auth/me                   — current user

GET  /preferences               — get user preferences
PUT  /preferences               — create or update preferences

GET  /articles                  — paginated feed
                                  ?tags=llm,tooling
                                  ?depth=3
                                  ?page=2
GET  /articles/:id              — single article

POST /pipeline/run              — manually trigger scrape (dev only)
```

---

## Getting started

### Prerequisites

- Node.js 18+
- pnpm (`npm install -g pnpm`)
- A Supabase project
- A Groq API key (free at console.groq.com)

### 1. Clone and install

```bash
git clone https://github.com/your-username/ai-news-aggregator.git
cd ai-news-aggregator
pnpm install
```

### 2. Environment variables

```bash
# apps/api/.env
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
GROQ_API_KEY="gsk_your-key"
NODE_ENV="development"
PORT=3001
WEB_URL="http://localhost:5173"

# apps/web/.env
VITE_SUPABASE_URL="https://your-project.supabase.co"
VITE_SUPABASE_ANON_KEY="your-anon-key"
VITE_API_URL="http://localhost:3001"
```

### 3. Run migrations

```bash
cd apps/api
npx prisma migrate dev --name init
npx prisma generate
```

### 4. Start development

```bash
# from project root
pnpm dev
```

- API runs at `http://localhost:3001`
- Frontend runs at `http://localhost:5173`

The scraping pipeline runs automatically 3 seconds after the API boots. To trigger it manually:

```bash
curl -X POST http://localhost:3001/pipeline/run
```

---

## Topic taxonomy

Articles are tagged with one or more of these categories:

`llm` `model-release` `research-paper` `open-source` `computer-vision` `policy` `startup-funding` `tooling` `robotics` `multimodal`

Technical depth is scored 1–5:

| Score | Meaning |
|---|---|
| 1 | General news, announcements |
| 2 | Some technical context |
| 3 | Engineering detail, architecture |
| 4 | Research level |
| 5 | ArXiv paper with math |

---

## Deployment

The API is to be deployed on Railway . The frontend is to be deployed on Vercel. 

```bash
# Production build
pnpm build
```

---

## License

MIT
