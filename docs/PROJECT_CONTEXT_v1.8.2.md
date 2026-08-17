# SU2QC project context v1.8.2

This is a standalone handoff for the SU2QC academic collaboration website. It is intentionally secret-free and does not depend on chat history.

## Identity and public surface

- Public site: https://su2qc.github.io/
- Organization source and Pages repository: `SU2QC/su2qc.github.io`
- Organization branches: `main` is source; `gh-pages` is the manually published static export.
- Planned disaster-recovery repository: private `digonto10602/su2qc-website-backup`.
- Supabase project URL: `https://zvhachktcgnkxwtdxucj.supabase.co`.
- Supabase project ref: `zvhachktcgnkxwtdxucj`.
- Content/source commit used to generate the final graph: `44845fd7b50baf7f794edcb89ba908c4dd0ae8dd`.
- Organization source/artifact commit: `7433354612c28b33d562f03e9a08ab5ddd77a362`.
- Current organization `gh-pages`: `7bb768760ac5b8a76e22c3ffd8574996a7969a33`.
- Personal-backup content commit: `689db25d11bec79a6dc499cffa210b4103540216`.

## Repository structure

| Path | Responsibility |
|---|---|
| `app/` | Next.js App Router routes and root metadata/layout. |
| `components/` | Shared header, footer, section-intro, login, upload, and library UI. |
| `data/people.js` | Source-backed investigator names, roles, affiliations, biographies, links, and public image paths. |
| `lib/` | Browser-safe Supabase configuration/auth helpers, redirects, validation, rate limiting, and upload status. |
| `public/` | Public logo, research diagram, favicon, and emitted investigator assets. |
| `supabase/migrations/` | Ordered SQL history for the remote schema, grants, foreign keys, and security hardening. |
| `supabase/functions/` | Trusted upload/download Edge Functions plus shared validation, CORS, auth, BibTeX, and cleanup logic. |
| `tests/` | Node test suite for parsing, validation, auth/config boundaries, routes, assets, and Edge Function behavior. |
| `scripts/` | Local layout QA and authentic Graphify generation/validation. |
| `docs/` | Source register, operating guides, execution reports, project context, Graphify graph, and Obsidian vault. |
| `.release-git/.git` | Effective Git metadata for this checkout; the root has no `.git` directory. |

Ignored or disposable material includes `node_modules/`, `.next/`, `out/`, `.codex-tmp/`, `.env*`, `source_image/`, caches, browser profiles, and local fixtures. The ignored `source_image/` originals are audit inputs, not public deployment inputs.

## Architecture and data flow

```text
Browser -> static Next.js/GitHub Pages HTML, CSS, JS, public assets
       -> Supabase Auth (browser session)
       -> public.members allowlist check
       -> RLS-protected public.materials metadata
       -> materials-upload Edge Function -> private Storage + metadata row
       -> material-download Edge Function -> signed private Storage URL
```

```text
source_image/ + data/people.js
       -> public/images/investigators/
       -> Next static export (`out/`)
       -> organization `gh-pages`
       -> https://su2qc.github.io/people/
```

The browser performs usability validation only. Trusted Edge Functions repeat origin, method, session, active-member, extension, MIME, size, signature, ownership, and cleanup checks. The service-role key is confined to Edge Function configuration and is never a browser variable.

## Static Next.js and GitHub Pages behavior

`next.config.mjs` enables static export and the repository's Pages base-path behavior. Build with the public site URL so generated links and asset paths target the Pages site. The deployable tree is `out/` plus `.nojekyll`; no build or test workflow is added to GitHub.

The public routes are `/`, `/research/`, `/people/`, `/library/`, `/login/`, and `/upload/`. The last two are member surfaces even though their shell is statically hosted. Static output cannot contain private data; runtime Supabase requests provide auth, metadata, and signed downloads.

## Supabase model and security

Remote migration identity is:

1. `20260816165238` — `v1_4_0_live_supabase_bootstrap`
2. `20260816165437` — `v1_4_0_live_supabase_grant_hardening`
3. `20260816172657` — `v1_4_0_live_supabase_fk_hardening`
4. `20260816205504` — `v1_6_0_security_hardening`

The application tables are `public.members` and `public.materials`. Members use lowercase email, display name, role (`admin` or `member`), active status, and timestamps. Materials reference a member, title/description/citation metadata, private storage path, filename, MIME type, bounded size, status, and timestamp. RLS is enabled. The `materials` Storage bucket is private.

The approved operator identity is the active member `misla004@odu.edu` with display name `Md Habib E Islam Digonto`; production checks expose only safe status/count evidence. Unauthenticated users must not upload, insert, update, delete, or download private objects. The Edge Functions are active: `materials-upload` and `material-download`; both are JWT-verifying in application code because the deployed function metadata reports `verify_jwt: false`.

The only current security-advisor warning is `auth_leaked_password_protection`, classified `ACCEPTED — PLAN-GATED` because the dashboard/plan setting is not independently readable through the available read-only project tools. Performance advisories previously recorded four RLS initialization-plan warnings and one informational unused index; no remote change is authorized merely to silence those notices.

## Upload, library, and signed download

Supported uploads are PDF, PPT, PPTX, and Keynote (`.pdf`, `.ppt`, `.pptx`, `.key`) up to 50 MiB. Extension, MIME, non-empty size, and file-signature checks are applied in both browser usability code and the trusted upload function. BibTeX is parsed and normalized by the Edge Function; malformed input is rejected.

The upload function authenticates the bearer session, verifies an active approved member, validates the file and metadata, writes the object to the private bucket, inserts metadata, and removes the object if metadata insertion fails. The library reads permitted public metadata. The download function authorizes the material and returns a short-lived signed URL; private object bytes are never made public.

## Investigator data and image mapping

| Investigator | Source | Emitted public asset | Current dimensions |
|---|---|---|---:|
| Kwangmin Yu | `source_image/Kwangmin Yu.jpeg` | `public/images/investigators/kwangmin-yu.jpeg` | 400x400 |
| Paulo F. Bedaque | `source_image/Paulo F. Bedaque.jpg` | `public/images/investigators/paulo-f-bedaque.jpg` | 190x251 |
| Raza Sabbir Sufian | `source_image/Raza Sabbir Sufian.png` | `public/images/investigators/raza-sabbir-sufian.png` | 200x300 |
| Taku Izubuchi | `source_image/Taku Izubuchi.jpg` | `public/images/investigators/taku-izubuchi.jpg` | 120x160 |

The three unchanged portraits preserve source bytes. Paulo's public photograph is the corrected, intentionally resized derivative; the live public bytes match the emitted local asset. `data/people.js` supplies one-to-one image paths and nonempty alt text. Public biographies and official profile links are registered in `docs/SOURCES.md`.

## Public configuration names

The static browser may receive only these public names: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, and `NEXT_PUBLIC_SITE_URL`. Values belong in local `.env.local` or the established production configuration; values are not recorded here. Never expose a service-role key, password, token, session cookie, or signed URL.

## Local commands

```bash
npm ci
cp .env.example .env.local
npm test
npm run lint
NEXT_PUBLIC_SITE_URL=https://su2qc.github.io npm run build
SU2QC_BASE_URL=http://localhost:3000 npm run check:layout
npm run docs:graph
npm run docs:graph:validate
npm run docs:obsidian:validate
```

Run `npm run dev` only in the foreground for local browser checks and stop it afterward. Graphify requires `graphify 0.9.45`, Ollama at `127.0.0.1:11434`, model `qwen2.5-coder:7b`, Python environment imports `openai` and `tree_sitter_sql`, concurrency 1, and a 120-second API timeout. `npm run docs:graph` stages release-Git `HEAD`, excludes generated graph/vault output, runs the real Graphify/Ollama extraction, performs bounded semantic retries, validates records, exports HTML/GraphML, and regenerates this vault. The current gate used Graphify 0.9.45 and local Ollama 0.30.10.

## Graphify and Obsidian

The final declared graph scope is 66 first-party files: 46 code, 13 Markdown documents, 1 paper, and 6 public images, with eight documented exclusion entries/patterns. The machine-readable backup manifest is separately validated and excluded because Graphify 0.9.45 produces no node for it. The graph contains 265 nodes, 348 valid edges, 2 hyperedges, 32 communities, and node types recorded in `statistics.json`. Edge provenance is 344 `EXTRACTED` and 4 `INFERRED`. All 66 included files have at least one node, all endpoints validate, and no generated graph/vault source is included.

Artifacts are under `docs/codebase-graph/`: `graph.json`, `graph.html`, `graph.graphml`, `GRAPH_REPORT.md`, `statistics.json`, `generation-metadata.json`, `included-files.json`, `exclusions.json`, and `unresolved-relationships.md`. The generated `docs/obsidian-vault/` contains 242 Graphify node mappings, 279 notes, the central `SU2QC Codebase Map.md`, 25 subsystem notes, and `SU2QC Architecture.canvas`. Validation is `npm run docs:graph:validate` (also the vault validator).

Graphify is static extraction plus local semantic model output. It cannot prove dynamic browser, Auth, RLS, Storage, or runtime Edge Function relationships. Malformed and out-of-scope model records are counted and discarded; relationships are not invented. Graphify-native IDs are preserved.

## Deployment and recovery

The established deployment is local `npm run build`, source push to organization `main`, then publication of only `out/` and `.nojekyll` to organization `gh-pages`. Verify the Pages deployment run in GitHub, then check public HTTP 200, asset hashes, route rendering, console errors, unhandled rejections, and LFS-pointer absence. The current Pages output is approximately 3.1 MiB and has no file near GitHub limits.

The personal backup is a curated private repository owned by `digonto10602`, not a Pages source. It includes secret-free source, tests, migrations, Edge Functions, public assets, graph, vault, and documentation; it excludes dependencies, builds, caches, private uploads, database dumps, credentials, profiles, and temporary evidence. Git LFS is not needed because no necessary file is near 50 MiB. Restore by cloning its `main` into `.codex-tmp/backup-restore-check/`, checking the manifest and important paths, then removing only that exact disposable clone. The initial content commit is `689db25d11bec79a6dc499cffa210b4103540216`; a post-report synchronization is performed separately.

## Current verification inventory

- Node tests: 27/27 passed.
- ESLint: passed with no lint errors.
- Next production build: passed; static routes prerendered.
- Chrome responsive gate: 24 route/viewport checks passed at 390, 768, 1024, and 1440 pixels.
- Investigator source/emitted/live hashes: all four live hashes match emitted local hashes.
- Graph and vault validation: passed, 64/64 coverage.
- Live HTTP: all required routes, favicon, and investigator assets returned 200.
- Supabase read-only identity, migration, schema, functions, and security-advisor checks: passed with the plan-gated warning above.
- No production upload fixture was created because runtime upload/auth/storage code was unchanged.

## Prohibited operations and known limits

Do not reapply historical migrations, weaken RLS/Auth/Storage/CORS, alter member credentials or ownership, create public storage access, add GitHub Actions builds/tests, force-push, rewrite history, use LFS in `gh-pages`, print secrets, or run shutdown/reboot/poweroff commands. Do not infer dashboard-only settings or private row contents from adjacent evidence. Warnings from Graphify model nondeterminism, mixed Node module type detection, and Supabase advisor state must remain explicit.

## Next-session starting commands

```bash
cd /home/digonto/Codes/Github_repos/SU2QC_starter_v1.0.0
git --git-dir=.release-git/.git --work-tree="$PWD" status --short
sed -n '1,240p' docs/EXECUTION_REPORT_v1.8.2.md
sed -n '1,260p' docs/PROJECT_CONTEXT_v1.8.2.md
npm test && npm run lint
```

## Disaster-recovery checklist

1. Confirm the organization repository, branch heads, and public URL before changing anything.
2. Clone the private backup and verify `docs/BACKUP_MANIFEST_v1.8.2.json` before restoring.
3. Restore dependencies with `npm ci`; provide public environment values locally only.
4. Run tests, lint, build, graph/vault validators, and static browser checks.
5. Compare local migrations to remote migration identity; never reapply historical migrations.
6. Publish `out/` to `gh-pages` only after a byte/file diff and production verification.
7. Keep credentials, private uploads, database data, and authenticated browser state out of Git and reports.
