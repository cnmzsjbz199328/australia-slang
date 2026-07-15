# Australia Slang

Australian slang dictionary and quiz – a **fully static, front-end-only** Next.js app. No database, no backend, no auth: all content lives in versioned JSON and the site exports to plain HTML/CSS/JS.

## Stack

- **Framework**: Next.js 16 (App Router, static export), TypeScript, React 19
- **Styling**: Tailwind CSS
- **Data**: static JSON in `src/data` (validated with Zod at build time)

## How it works

- The dictionary and the quiz are both derived from `src/data/data-batch-*.json` — the single source of truth.
- The dictionary page filters and paginates in the browser; each term also gets its own statically-generated, SEO-friendly page at `/slang/<slug>`.
- The quiz draws and scores questions entirely client-side.
- There is no runtime API or database, so there is nothing to provision or secure.

## Setup

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

- `npm run dev` – start dev server
- `npm run build` – validate data, then produce a static export in `out/`
- `npm run lint` – run ESLint
- `npm test` – run Jest unit tests (pure functions, no database required)
- `npm run validate-data` – validate the slang dataset against the Zod schema

## Routes

- `/` – Home (rotating featured terms)
- `/slang` – Slang dictionary (client-side search + pagination)
- `/slang/<slug>` – Individual term page (statically generated)
- `/quiz` – Quiz

## Editing content

Content management is "edit JSON + commit" — Git is the CMS, with built-in history and review.

1. Edit or add entries in `src/data/data-batch-*.json`. Each entry is:

   ```json
   {
     "phrase": "G'day",
     "meaning": "Hello; good day",
     "example": "G'day mate! How are you going?",
     "quiz": {
       "question": "What does 'G'day' mean?",
       "explanation": "A casual Australian greeting.",
       "choices": [
         { "text": "Hello; good day", "isCorrect": true },
         { "text": "Goodbye", "isCorrect": false }
       ]
     }
   }
   ```

2. Run `npm run validate-data` (also runs automatically before `build` and `test`). It rejects malformed entries and duplicate phrases.

See `AI_DATA_GENERATION_PROMPT.md` for generating new batches.

## Deploy

`npm run build` writes a static site to `out/`. Deploy that directory to any static host:

- **Vercel**: import the repo; it detects the static export automatically.
- **Cloudflare Pages / Netlify**: build command `npm run build`, output directory `out`.
- **GitHub Pages**: publish the `out/` directory.

Optionally set `NEXT_PUBLIC_SITE_URL` to your canonical domain so `sitemap.xml`, `robots.txt`, and Open Graph URLs are absolute.

## Project layout

- `src/data` – slang JSON batches + Zod schema (source of truth)
- `src/lib` – pure data functions (`slang.ts`, `quiz.ts`, `dataset.ts`)
- `src/app` – pages (home, dictionary, term detail, quiz) + `sitemap.ts` / `robots.ts`
- `src/components` – UI components (slang, quiz, layout, common, home)
- `src/hooks` – client UI state (`useSlangSearch`, `useQuiz`)
- `scripts` – build-time data validation
- `tests` – Jest unit tests

See `coderule.md` for coding conventions.
