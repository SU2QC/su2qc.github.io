# SU2QC

Academic collaboration website for AI-accelerated quantum simulation of non-Abelian gauge dynamics.

## Architecture

- Next.js App Router exported as static HTML for GitHub Pages
- Supabase browser authentication and RLS-protected public library reads
- Supabase Edge Functions for authenticated upload validation and signed downloads
- Private Supabase Storage bucket for PDF, PowerPoint, and Keynote uploads
- Row-level security with the explicit `public.members` allowlist
- Edge-side BibTeX parsing and conventional formatted references

GitHub Pages hosts only the public static site. Supabase retains authentication, authorization, private storage, metadata, and signed-download responsibilities.

## Local setup

1. Create a Supabase project and apply the migrations in `supabase/migrations/` in order, or use the project-scoped Supabase migration runner.
2. Add approved users to `public.members`, always using lowercase email addresses; authentication alone does not grant upload access.
3. Copy `.env.example` to `.env.local` and fill in only the public project URL, publishable key, and local site URL. Never put a secret or service-role key in a `NEXT_PUBLIC_*` variable.
4. Use the repository-local cache, password sign-in, and static preview command in [docs/UPLOAD_GUIDE.md](docs/UPLOAD_GUIDE.md).
5. In Supabase Auth URL configuration, allow both `http://localhost:3000/**` and `http://127.0.0.1:3000/**` if both local origins are used.

## Verification

Run `npm test`, `npm run lint`, `npm run build`, and `npm run check:layout`. The build must create `out/index.html`.

## Deployment

Build locally, push source to `main`, and publish only `out/` plus `.nojekyll` to `gh-pages` in `SU2QC/su2qc.github.io`. Configure GitHub Pages to deploy `gh-pages` from the repository root. Do not use GitHub Actions for builds or tests.

## Privacy

Public copy is based on official public sources listed in `docs/SOURCES.md`.
