# SU2QC v1.7.0 production-security and polish gate

Date: 2026-08-17
Repository: `SU2QC/su2qc.github.io`
Production: https://su2qc.github.io/
Supabase project ref: `zvhachktcgnkxwtdxucj`

## Executive result

`SU2QC V1.7.0 PRODUCTION SECURITY AND POLISH GATE: BLOCKED`

All code, local QA, Supabase schema/security, and production authorization gates completed except the Supabase Auth dashboard verification described below. The remaining blocker is informational but must be resolved honestly: the connected Supabase MCP exposes neither Auth URL/signup configuration nor the current billing plan. The security advisor still reports leaked-password protection disabled, so it cannot yet be classified as `ACCEPTED — PLAN-GATED` without confirming the project is on Free, or as enabled without changing the supported Auth setting.

Required next dashboard action for project `zvhachktcgnkxwtdxucj`:

1. Open Supabase Dashboard → project → Authentication → URL Configuration and verify Site URL is `https://su2qc.github.io/`.
2. Verify the production redirect allowlist contains `https://su2qc.github.io/**`; retain only required local-development redirects such as `http://localhost:3000/**` and `http://127.0.0.1:3000/**`.
3. Open Authentication → Providers → Email and verify public signup is disabled while email/password sign-in remains enabled for existing approved members.
4. Confirm the project plan in Billing/Usage. On Free, record this advisor warning as `ACCEPTED — PLAN-GATED`; on Pro or above, enable leaked-password protection, then rerun the security advisor.

## Baseline and repository

- v1.6.2 report was read completely before changes.
- Effective release Git metadata is in `.release-git/.git`; the repository root intentionally has no top-level `.git` directory.
- Organization remote: `https://github.com/SU2QC/su2qc.github.io.git` for fetch and push.
- Baseline main commit: `4a703bd6b6f76fd12a35e12b55a872dcc43b4bfc` (`Record v1.6.2 production browser gate`).
- Baseline deployed gh-pages commit: `d36c2a0863d4eccd426fa96463d1c5460c14372b` (`Publish v1.6.1 upload remediation`).
- GitHub Pages is configured as the existing legacy branch deployment from `gh-pages`; no custom workflow was added.
- Baseline live route checks were HTTP 200 for `/`, `/login/`, `/upload/`, and `/library/`.
- Baseline `/favicon.ico` reproduced HTTP 404.
- Supabase `get_project_url` returned `https://zvhachktcgnkxwtdxucj.supabase.co`; the project ref matched exactly before every remote operation.

## Files changed

- `app/favicon.ico`: transparent ICO generated from the existing SU2QC brand mark crop; includes 16, 32, 48, and 64 pixel images. The main logo was not redesigned.
- `app/layout.js`: explicitly references `/favicon.ico` through App Router metadata.
- `components/upload-form.js`: captures the form element before the awaited upload request, then resets that stable reference.
- `eslint.config.mjs`: ignores only generated `.codex-tmp/**` and `.tmp/**` output, in addition to existing `.next/**` and `node_modules/**` ignores.
- `tests/repository.test.mjs`: checks the ICO header/metadata reference and guards against the async React event-target regression.
- `docs/EXECUTION_REPORT_v1.7.0.md`: this evidence report.

No migration, Edge Function, RLS policy, storage policy, grant, Auth user, member role, active status, ID, email, or password was changed.

## Favicon and metadata

The existing wide SU2QC logo was cropped to its square graphical mark so the icon contains no unreadable small text. `app/favicon.ico` contains valid 16×16, 32×32, 48×48, and 64×64 ICO entries. The source logo remains unchanged.

Local verification passed:

- `app/favicon.ico` is a valid ICO.
- `out/favicon.ico` is emitted by `next build` with all four sizes.
- Static HTML contains the Next-generated 64-pixel icon reference and `/favicon.ico` metadata reference.
- Repository regression test verifies the ICO header and metadata declaration.

The final live HTTP 200 check is recorded after the Pages deployment below.

## ESLint warning correction

The two v1.6.2 warnings came from `eslint .` traversing retained generated browser/static evidence under `.tmp/pages-v1.6.1/**` and `.tmp/pages/**`. The generated bundle contained an internal `window.location.href` use; it was not application source.

The narrow correction is explicit global ignores for `.tmp/**` and `.codex-tmp/**`. Source directories remain linted. `npm run lint` now exits cleanly with zero errors and zero warnings.

## Promise-event investigation

The temporary Chrome/CDP runner was instrumented to retain only redacted event metadata: message, sanitized stack, URL without query strings, lifecycle phase, closing state, navigation, request association, cancellation state, and response status. Authorization headers, credentials, tokens, signed URL query strings, and session data were not retained.

The first instrumented production run reproduced the event during `upload-submit` while the page/context was still open:

`TypeError: Cannot read properties of null (reading 'reset')`

The cause was `event.currentTarget.reset()` after an awaited fetch. React no longer guarantees `currentTarget` after the await. The smallest fix captures `const formElement = event.currentTarget` before the await and calls `formElement.reset()` after success. The repository regression test protects this exact pattern.

Final controlled run after deployment: marker `SU2QC-V1.7.0-GATE-20260817050201-c78346ff`; fixture size 2,658 bytes; uploaded/downloaded SHA-256 `e25837629891d9298499439d4ed57db25b6160ca0ea16f9f3184763e0659b64d`; downloaded filename matched the current fixture; page errors `0`; console errors/unhandled rejections `0`. The run recorded 12 expected `ERR_ABORTED` navigation/teardown requests, with no broken asset response. Favicon loaded HTTP 200 during every controlled browser context.

## Supabase security audit

Read-only MCP evidence for project `zvhachktcgnkxwtdxucj`:

- Security advisor: only `auth_leaked_password_protection` remains at WARN.
- Performance advisor: four `auth_rls_initplan` warnings and informational unused-index notice for `materials_member_id_idx`; no schema change was made because the live security migration already contains the reviewed policy form and the index remains useful for ownership queries.
- Applied migration history: the three v1.4 migrations plus `20260816205504` (`v1_6_0_security_hardening`). No migration was reapplied.
- `public.members` and `public.materials` have RLS enabled.
- `storage.objects` and `storage.buckets` have RLS enabled.
- The `materials` bucket is private, has a 50 MiB limit, and allows only the reviewed PDF/PPT/PPTX/Keynote MIME types.
- Effective table grants match the reviewed model: public reads are constrained by RLS; authenticated members have only the required table operations; administrative grants remain service-role/owner-side.
- Storage’s system ACL rows include roles that are normally present in the Supabase storage schema, but the effective RLS policies grant anonymous users no upload path. The `approved uploads` policy is authenticated-only and the Edge Function separately requires a bearer token, active member, exact origin, file validation, and repeated authorization checks.
- `materials-upload` and `material-download` are both ACTIVE, version 1, with custom authorization inside the functions (`verify_jwt: false`).
- Remote function source confirms exact production CORS origin `https://su2qc.github.io` plus the retained local development origins.
- No service-role key is used by the static client; service-role access appears only inside the Edge Functions.
- The approved-member query returned exactly one active row for `misla004@odu.edu`, role `member`, with display name `Md Habib E Islam Digonto`.

The leaked-password advisor warning is not suppressed or falsified. Its final classification is blocked pending the plan confirmation in the dashboard checklist above.

## Production browser authorization gate

The pre-edit v1.6.2 production run passed login, `/upload/` access, real browser file-input upload, HTTP 201, library rendering, signed download, hash equality, unauthenticated redirect/401/private-object denial, and exact cleanup. It also reproduced the application promise bug documented above.

The final post-deployment run used a unique `SU2QC-V1.7.0-GATE-*` PPTX fixture, fresh marker-specific Chrome profiles under `.codex-tmp`, the actual production login form, browser file input, upload button, library `Open` link, and fresh unauthenticated context. It verified:

- authenticated navigation to `/upload/` and contributor `Md Habib E Islam Digonto`;
- HTTP 201 and success UI;
- library visibility and signed download;
- uploaded/downloaded SHA-256 equality;
- unauthenticated `/upload/` redirect with no file input;
- unauthenticated function POST HTTP 401;
- private public-object denial;
- zero fixture rows and objects after cleanup, with total counts returned to baseline 3/3;
- zero console errors and zero unhandled page promise rejections: PASS.

Observed response classes: login route `200`, upload route `200`, favicon `200`, upload CORS preflight `204`, upload POST `201`, library/material reads `200`, signed storage download `200`, unauthenticated upload POST `401`, and private public-object request `400`. The library rendered `Md Habib E Islam Digonto`.

## Local validation

- `npm test`: PASS, 26/26.
- `npm run lint`: PASS, zero errors and zero warnings.
- `NEXT_PUBLIC_SITE_URL=https://su2qc.github.io npm run build`: PASS with Next.js 16.3.1; all routes statically prerendered.
- Static routes emitted: `/`, `/research/`, `/people/`, `/library/`, `/login/`, `/upload/`.
- Static favicon emitted: `out/favicon.ico`; metadata references verified.
- Static-bundle scan: no service-role markers, no `NEXT_PUBLIC` service key, no bearer-token values, no JWT-like token values, and no `sb_secret_` value with a key suffix.
- Responsive DOM check: PASS at 390, 768, 1024, and 1440 px for `/`, `/research`, `/people`, `/library`, `/login`, and `/upload`; zero horizontal overflow, exactly one H1, and stacked heading/description pairs.
- Accessibility source/DOM checks: PASS for skip link, visible focus styling, reduced-motion handling, labeled forms, live status regions, semantic route headings, and 44px controls.
- Impeccable detect: PASS, zero findings.
- Impeccable doctor: PASS, zero findings; rule registry available.

## Cleanup and secrets

The v1.7.0 disposable fixture was removed through the authenticated Storage API followed by an exact `public.materials` row delete. Final read-only verification returned total materials `3`, private materials objects `3`, v1.7 fixture rows `0`, and v1.7 fixture objects `0`. The approved-member verification still returned exactly one active `member` row with display name `Md Habib E Islam Digonto`.

The member password was consumed only from `SU2QC_MEMBER_PASSWORD` in the inherited process environment. It was not printed, passed as a command argument, written to a file, included in screenshots/traces/reports, or committed. Temporary profiles, downloads, and generated browser evidence remain under ignored `.codex-tmp/`; authenticated profiles and disposable fixtures are removed after the final run. No custom GitHub Actions workflow was created.

## Deployment identifiers

- Baseline main: `4a703bd6b6f76fd12a35e12b55a872dcc43b4bfc`.
- Implementation main: `017f80fdbd6b2c3b6565dfa4252d1270b66acca8` (`Polish v1.7.0 production security gate`).
- Baseline gh-pages: `d36c2a0863d4eccd426fa96463d1c5460c14372b`.
- Final gh-pages: `b173a8fa1638512b7888ee60b1eda7ea840d7d05` (`Publish v1.7.0 favicon and upload fix`).
- Baseline Pages run: `31990210789`, success.
- Final Pages run: `31996318896`, success; https://github.com/SU2QC/su2qc.github.io/actions/runs/31996318896.
- Final live checks: `/favicon.ico`, `/`, `/login/`, `/upload/`, and `/library/` all HTTP 200; live metadata references the icon; the final fresh-context browser gate passed and cleanup returned the 3/3 baseline.
