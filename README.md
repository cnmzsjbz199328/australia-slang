# Australia Slang

Australian slang dictionary and quiz app – Next.js full-stack, deployable on Vercel.

## Stack

- **Frontend / Backend**: Next.js 16 (App Router), TypeScript, React 19, Tailwind CSS
- **Database**: PostgreSQL + Prisma
- **Validation**: Zod

## Setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Database**

   - Create a PostgreSQL database (e.g. [Neon](https://neon.tech), [Supabase](https://supabase.com), or local).
   - Copy `.env.example` to `.env` and set `DATABASE_URL`.

   ```bash
   cp .env.example .env
   # Edit .env and set DATABASE_URL
   ```

3. **Migrations and seed**

   ```bash
   npx prisma migrate dev
   npx prisma db seed
   ```

4. **Run dev server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## Scripts

- `npm run dev` – start dev server
- `npm run build` – production build
- `npm run start` – start production server
- `npm run lint` – run ESLint
- `npm test` – run Jest tests (requires `DATABASE_URL` and migrated DB)
- `npm run seed` – run Prisma seed

## Routes

- `/` – Home
- `/slang` – Slang dictionary (list + detail)
- `/quiz` – Quiz
- `/admin` – Admin home
- `/admin/slang` – Manage slang terms (CRUD)
- `/admin/quiz` – Manage quiz questions (CRUD)

## Deploy (Vercel)

1. Push the repo to GitHub and import the project in Vercel (use the `australia-slang` folder as root if the repo root is the parent).
2. Set `DATABASE_URL` in Vercel project settings.
3. After first deploy, run migrations against the production DB:

   ```bash
   npx prisma migrate deploy
   ```

4. Optionally run seed once: `npx prisma db seed`.

## Project layout

- `src/app` – pages and API routes
- `src/components` – UI components (slang, quiz, admin, layout, common)
- `src/hooks` – data hooks (useSlangSearch, useQuiz, useSlangAdmin, useQuizAdmin)
- `src/lib` – db, services, repositories, validators, errors
- `prisma` – schema, migrations, seed
- `tests` – Jest API tests

See `coderule.md` (in repo root) for coding conventions.
