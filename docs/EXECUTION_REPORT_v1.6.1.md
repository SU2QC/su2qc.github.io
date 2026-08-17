# SU2QC v1.6.1 upload remediation report

Date: 2026-08-16  
Repository: `SU2QC/su2qc.github.io`  
Production URL: https://su2qc.github.io/upload/  
Supabase project ref: `zvhachktcgnkxwtdxucj`

## Gate result

`SU2QC V1.6.1 UPLOAD REMEDIATION GATE: BLOCKED`

The frontend correction is deployed and the production API workflow passes. The required real-browser upload gate is not claimable from this host: Chrome reports `ERR_INTERNET_DISCONNECTED`, Firefox cannot create its sandbox runtime directory, and the prior loopback DevTools runner was denied socket binding. No browser-visible production upload result was fabricated.

## Root cause

The exact source was the catch on `components/upload-form.js:27`. It covered four unrelated operations: browser Supabase client creation/configuration, session retrieval, the cross-origin upload fetch, and JSON response parsing. Any exception in those operations produced the same text, `The upload is temporarily unavailable.`

Remote evidence shows the Supabase project and functions were healthy: the production origin passed CORS preflight, POST without a JWT returned `401` with `Access-Control-Allow-Origin`, and the authenticated production fallback recorded upload `201` and signed download `302`. No Edge Function `5xx` was recorded for the reported symptom. Therefore the old message was a client-side exception bucket, not evidence of a database or Edge Function outage; the original browser exception was discarded by the old catch and cannot be recovered retrospectively.

The local `.env.local` had `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` present, but `NEXT_PUBLIC_SITE_URL` was present with a non-production value. `NEXT_PUBLIC_SITE_URL` is not consumed by the static upload code. The remediation build explicitly supplied `https://su2qc.github.io`; the static bundle contains the project URL and publishable key, contains no server-only key, and embeds the correct `/functions/v1/materials-upload` endpoint.

## Fix

- `lib/supabase/config.js` now strips trailing slashes from the public Supabase URL before endpoint construction.
- `components/upload-form.js` now handles configuration, session, fetch/network-CORS, invalid-response, and HTTP failures separately.
- `lib/upload-status.mjs` centralizes the safe user-facing state mapping.
- Expired sessions, inactive members, Edge Function unavailability, network/CORS failure, invalid service responses, and validation/upload errors now have distinct messages without exposing internal details.
- No Supabase migration was applied; schema and RLS evidence did not indicate a required database change.

## Supabase and CORS evidence

- `get_project_url`: exact project ref `zvhachktcgnkxwtdxucj`.
- `materials-upload`: `ACTIVE`, version `1`.
- `material-download`: `ACTIVE`, version `1`.
- Active approved member lookup for `misla004@odu.edu`: present.
- Intended member RLS policy: authenticated `SELECT` by lowercased JWT email; anonymous table select is not granted.
- Production `OPTIONS`: `204`, exact `Access-Control-Allow-Origin: https://su2qc.github.io`, and allowed headers include `authorization`, `apikey`, and `content-type`.
- Production POST without JWT: `401 Authentication required.` with the exact production origin allowed.

## Tests and local validation

- `npm test`: 24 passed.
- `npm run lint`: 0 errors; one pre-existing warning comes from ignored `.tmp/pages` generated output.
- `npm run build` with `NEXT_PUBLIC_SITE_URL=https://su2qc.github.io`: passed; all routes static.
- Plain static server: `/`, `/research/`, `/people/`, `/library/`, `/login/`, and `/upload/` returned `200`.
- `npx impeccable detect --json app components`: no findings.
- Static bundle regression checks: corrected endpoint and distinct state strings present; old generic string absent; server-only key names absent.
- Responsive/accessibility browser runner: host-blocked. This is the sole required gate not verified.

## Deployment

- `main` remediation commit: `37b2631` (`Fix production upload availability states`).
- `gh-pages` deployment commit: `d36c2a0` (`Publish v1.6.1 upload remediation`).
- Built-in GitHub Pages run: `31990210789`, successful.
- Live `/`, `/upload/`, and `/library/` routes: `200`.
- Live bundle: new network/configuration messages present, old generic message absent, upload endpoint present.

## Production API fallback and cleanup

The hidden-password production fallback completed after deployment and remote function logs recorded `201` upload, `302` signed download, and `401` unauthenticated denial. Generated fixture matching checks found zero rows after cleanup. The database currently contains three materials and three private storage objects that do not match the disposable v1.6.1 fixture markers; they were not deleted because they could be legitimate user materials.

The browser-level production test remains the only blocker to the requested PASS status. Run it in a browser-capable environment and verify the actual form submission, library rendering, signed-download byte equality, denial behavior, and fixture cleanup.
