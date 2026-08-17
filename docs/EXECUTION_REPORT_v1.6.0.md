# SU2QC v1.6.0 execution report

Date: 2026-08-16  
Repository: `SU2QC/su2qc.github.io`  
Production URL: https://su2qc.github.io/  
Supabase project ref: `zvhachktcgnkxwtdxucj`

## Gate result

`SU2QC V1.6 PRODUCTION GATE: PASS WITH WARNINGS`

The project-scoped Supabase migration and Edge Functions are live. The static export is published on GitHub Pages. The hidden-password production check completed with authenticated upload, signed download, denial checks, and cleanup. The only unresolved item is a Supabase Auth dashboard setting that is not exposed by the connected MCP tools: leaked-password protection remains disabled.

## Supabase preflight and migration

- `get_project_url` returned `https://zvhachktcgnkxwtdxucj`; the ref exactly matches `zvhachktcgnkxwtdxucj`.
- Applied migration: `supabase/migrations/005_v1_6_0_security_hardening.sql`, remote name `v1_6_0_security_hardening`, version `20260816205504`.
- The migration restricts `public.rls_auto_enable()` to `postgres`, fixes its `search_path`, and wraps JWT lookups in RLS policies with init-plan-safe `select` expressions.
- Remote migration history also contains the three existing v1.4 migrations: `v1_4_0_live_supabase_bootstrap`, `v1_4_0_live_supabase_grant_hardening`, and `v1_4_0_live_supabase_fk_hardening`.
- Final SQL checks: members `1`, materials `0`, materials storage objects `0`, materials bucket private, and anonymous/authenticated execution of `rls_auto_enable()` disabled.

Advisors after migration:

- Security: only `auth_leaked_password_protection` remains (`WARN`); enable it in Supabase Dashboard → Authentication → Providers → Email.
- Performance: Supabase still reports four `auth_rls_initplan` warnings and the informational unused `materials_member_id_idx` warning, despite the applied policy expressions using `(select auth.jwt() ->> 'email')`. The index was retained because it supports the member ownership path and the linter result is not a correctness failure.

## Edge Functions

Both functions were deployed through the project-scoped Supabase MCP and verified `ACTIVE`, version `1`, with custom authentication inside the function bodies (`verify_jwt: false`):

| Function | ID | SHA-256 |
|---|---|---|
| `materials-upload` | `691ab809-135b-4a15-8996-d732c71aab7d` | `11e7d788e7e2350d1a1b42a09250bbfec5353f87082e6a83ca502445b984807c` |
| `material-download` | `37c1274e-bea3-4381-b64e-e1ce90b91e2a` | `c1ff991d05324f7bf257bf088774b028ffb2e9ad49e9f0a1e9aa353e72efc621` |

Local unit coverage passed for origin/method/JWT gates, file validation, orphan cleanup, and signed download behavior. Supabase CLI and Deno were unavailable locally, so runtime deployment and remote negative checks were used for those gates.

## Static export and local validation

- `next.config.mjs` uses `output: "export"`, `trailingSlash: true`, and unoptimized images for GitHub Pages.
- Server-only API/auth route handlers were removed; browser Supabase clients and Edge Functions handle the public static site flow.
- `npm test`: 22 passed.
- `npm run lint`: passed.
- `npm run build`: passed; `out/` contains the six exported route trees.
- Plain static-server checks returned HTTP 200 for `/`, `/research/`, `/people/`, `/library/`, `/login/`, and `/upload/`.
- `npx impeccable detect --json app components`: no findings.
- No GitHub Actions workflow exists.
- The Chrome DevTools responsive runner could not bind its loopback port in the host sandbox; this is recorded as an environment limitation, not a site failure.

## GitHub Pages publication

- Public repository: https://github.com/SU2QC/su2qc.github.io
- Source branch: `main`; release source commit: `a026ec9b976961f6e7ef632d70dda78afa171621`; final documentation tip: `74ef34f`.
- Pages source: branch `gh-pages`, path `/`.
- Final Pages deployment trigger: built-in Pages run `31972845716`, completed successfully from `gh-pages` commit `1f47ed7bd26ce7e909a6ac0c13a87ba322a4d76b`.
- Production route checks returned HTTP 200 for all six exported routes; homepage and library content markers were present.
- Public-source staging scan found no private files, credentials, service-role assignments, or private workflows.

## Production verification

The disposable hidden-password check used the approved member account without exposing the password in chat. It exercised:

- production route availability;
- member authentication and active-member RLS access;
- real PPTX upload and BibTeX metadata submission;
- public library visibility;
- private member-prefixed object storage;
- signed download and byte comparison;
- unauthenticated upload denial and direct private-object denial;
- storage and database cleanup, followed by sign-out.

Remote function logs recorded the expected production response classes: upload `201`, signed download `302`, plus `401`/`403` denial responses. Final read-only SQL verification found no material row and no object remaining in the materials bucket.

## Manual follow-up

In the Supabase Dashboard for project `zvhachktcgnkxwtdxucj`, set Authentication → URL Configuration → Site URL to `https://su2qc.github.io`, retain local development URLs, add `https://su2qc.github.io/**` as a redirect URL if absent, and enable Email-provider leaked-password protection. The connected MCP surface does not expose these Auth settings, so they were not changed by this run.
