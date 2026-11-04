# What To Watch

Smart movie and TV discovery — trending picks, mood-based recommendations, collections, reviews, and squad swipe sessions.

## Stack

- Next.js 14 (App Router) + TypeScript + Tailwind
- TMDB API for media data
- Clerk for auth (optional in local/dev)
- Prisma + PostgreSQL (use a hosted Postgres URL; see Production notes)

## Setup

1. Copy env template and fill keys:

```bash
cp .env.example .env.local
```

2. Install and generate the Prisma client:

```bash
npm install
npx prisma generate
npx prisma db push
```

3. Start the app:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Required env

| Variable | Purpose |
|----------|---------|
| `TMDB_API_KEY` | TMDB v3 API key |
| `DATABASE_URL` | Prisma connection string |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk (optional locally) |
| `CLERK_SECRET_KEY` | Clerk (optional locally) |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL for metadata |

Without `TMDB_API_KEY`, the app falls back to mock data.

## Scripts

- `npm run dev` — development server (Turbo)
- `npm run build` — production build
- `npm run start` — serve production build
- `npm run lint` — ESLint
- `npm run db:push` — sync Prisma schema
- `npm run db:studio` — Prisma Studio

## Production notes

- Use a hosted Postgres URL for `DATABASE_URL` (do not ship SQLite).
- Remove or never deploy debug tooling; env secrets must stay in the host env, not the repo.
- Configure Clerk webhooks to `/api/webhooks/clerk` for user sync.
- Set `NEXT_PUBLIC_SITE_URL` to your live domain in the hosting environment.
- Submit `https://<your-live-domain>/sitemap.xml` in Google Search Console after deployment.
