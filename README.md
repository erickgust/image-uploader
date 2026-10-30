<h1>
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="public/hoist-lockup-dark.svg">
    <img src="public/hoist-lockup-light.svg" alt="Hoist" height="48">
  </picture>
</h1>

Upload an image and get a short link to share it. Built with Next.js and Supabase.

## Features

- Upload by drag and drop, file picker, or pasting from the clipboard
- JPG, PNG and GIF up to 4 MB
- The server checks the file's real format, not just its extension
- Short share links (`/<id>`) that open the full image
- Light and dark theme

## Tech stack

- [Next.js](https://nextjs.org) (App Router) and React
- [Supabase](https://supabase.com) Storage and Postgres
- Tailwind CSS
- Bun, oxlint, Prettier, Husky and lint-staged

## Getting started

### 1. Set up Supabase

In your Supabase project:

1. Create a **public** Storage bucket named `images`.
2. Create the `images` table:

   ```sql
   create table images (
     id bigint generated always as identity primary key,
     public_id text not null unique,
     url text not null,
     created_at timestamptz not null default now()
   );
   ```

The app talks to Supabase from the server only, using the secret key.

### 2. Configure environment variables

Create `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
SUPABASE_SECRET_KEY=<your secret key>
```

Keep `SUPABASE_SECRET_KEY` private. It bypasses row level security.

### 3. Run it

```bash
bun install
bun dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command           | What it does                  |
| ----------------- | ----------------------------- |
| `bun dev`         | Start the dev server          |
| `bun run build`   | Build for production          |
| `bun start`       | Run the production build      |
| `bun lint`        | Lint with oxlint              |
| `bun type-check`  | Type-check with TypeScript    |

## Project structure

```
src/
  app/
    api/upload/   POST endpoint: validates and stores the image
    [id]/         Page that shows an uploaded image
    page.tsx      Upload page
  components/     UI components
  hooks/          Drag-and-drop and paste hooks
  lib/supabase.ts Server-side Supabase client
```
