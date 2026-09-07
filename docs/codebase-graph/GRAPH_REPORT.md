# SU2QC Graphify 0.9.45 report

This report describes the authentic Graphify extraction and merge after validation. Graphify-native node IDs are preserved. Out-of-scope or malformed model records are counted in `unresolved-relationships.md` and are not repaired.

- Source commit: `5d48a473b47c3610bef39486373b03d237cfe5dd`
- Nodes: 324; edges: 448; hyperedges: 2; communities: 34.
- Edge provenance: EXTRACTED=434, INFERRED=14.
- Graphify input: 77 included files; 9 documented exclusions.

## Node types

- code: 247
- concept: 26
- document: 44
- image: 7

## Edge types

- calls: 91
- contains: 174
- hosts: 1
- imports: 85
- imports_from: 60
- indirect_call: 7
- method: 1
- reads_from: 2
- references: 16
- uses: 9
- writes_to: 2

## Source coverage

| Repository file | Graph nodes |
|---|---:|
| `DESIGN.md` | 1 |
| `PRODUCT.md` | 1 |
| `README.md` | 11 |
| `app/layout.js` | 6 |
| `app/library/page.js` | 3 |
| `app/login/page.js` | 3 |
| `app/my-materials/page.js` | 3 |
| `app/page.js` | 3 |
| `app/people/page.js` | 3 |
| `app/research/page.js` | 4 |
| `app/upload/page.js` | 4 |
| `app/vault/page.js` | 3 |
| `components/library-list.js` | 3 |
| `components/login-form.js` | 4 |
| `components/manage-materials.js` | 7 |
| `components/section-intro.js` | 2 |
| `components/site-footer.js` | 2 |
| `components/site-header.js` | 3 |
| `components/upload-form.js` | 5 |
| `components/vault-list.js` | 4 |
| `data/people.js` | 3 |
| `docs/EXECUTION_REPORT_v1.6.0.md` | 1 |
| `docs/EXECUTION_REPORT_v1.6.1.md` | 1 |
| `docs/EXECUTION_REPORT_v1.6.2.md` | 2 |
| `docs/EXECUTION_REPORT_v1.7.0.md` | 2 |
| `docs/EXECUTION_REPORT_v1.8.0.md` | 2 |
| `docs/EXECUTION_REPORT_v1.8.1.md` | 3 |
| `docs/EXECUTION_REPORT_v1.8.2.md` | 21 |
| `docs/EXECUTION_REPORT_v2.0.0.md` | 1 |
| `docs/PROJECT_CONTEXT_v1.8.2.md` | 14 |
| `docs/PROJECT_CONTEXT_v2.0.0.md` | 1 |
| `docs/QA_CHECKLIST.md` | 1 |
| `docs/SOURCES.md` | 1 |
| `docs/UPLOAD_GUIDE.md` | 2 |
| `eslint.config.mjs` | 2 |
| `lib/bibtex.mjs` | 5 |
| `lib/material-validation.mjs` | 10 |
| `lib/rate-limit.mjs` | 3 |
| `lib/safe-next.mjs` | 3 |
| `lib/supabase/auth.js` | 2 |
| `lib/supabase/client.js` | 2 |
| `lib/supabase/config.js` | 6 |
| `lib/upload-status.mjs` | 4 |
| `next.config.mjs` | 2 |
| `package.json` | 32 |
| `public/images/investigators/kwangmin-yu.jpeg` | 1 |
| `public/images/investigators/paulo-f-bedaque.jpg` | 1 |
| `public/images/investigators/raza-sabbir-sufian.png` | 1 |
| `public/images/investigators/taku-izubuchi.jpg` | 1 |
| `public/images/people/md-habib-e-islam-digonto.webp` | 1 |
| `public/images/su2qc-hero.png` | 1 |
| `public/images/su2qc-logo.png` | 1 |
| `scripts/check-stacked-headings.mjs` | 6 |
| `scripts/docs-graph.mjs` | 26 |
| `supabase/functions/_shared/authorization.js` | 3 |
| `supabase/functions/_shared/bibtex.js` | 4 |
| `supabase/functions/_shared/download-handler.js` | 2 |
| `supabase/functions/_shared/http.js` | 6 |
| `supabase/functions/_shared/manage-handler.js` | 7 |
| `supabase/functions/_shared/material.js` | 12 |
| `supabase/functions/_shared/upload-handler.js` | 4 |
| `supabase/functions/material-download/index.js` | 6 |
| `supabase/functions/materials-manage/index.js` | 6 |
| `supabase/functions/materials-upload/index.js` | 6 |
| `supabase/migrations/001_initial.sql` | 3 |
| `supabase/migrations/002_live_supabase_bootstrap.sql` | 2 |
| `supabase/migrations/003_v1_4_0_live_supabase_grant_hardening.sql` | 1 |
| `supabase/migrations/004_v1_4_0_live_supabase_fk_hardening.sql` | 1 |
| `supabase/migrations/005_v1_6_0_security_hardening.sql` | 1 |
| `supabase/migrations/006_v2_0_0_people_vault_otp.sql` | 5 |
| `tests/bibtex.test.mjs` | 1 |
| `tests/edge-functions.test.mjs` | 5 |
| `tests/material-validation.test.mjs` | 2 |
| `tests/repository.test.mjs` | 4 |
| `tests/safe-next.test.mjs` | 1 |
| `tests/supabase-config.test.mjs` | 1 |
| `tests/upload-status.test.mjs` | 1 |

## Limitations

Static AST extraction cannot prove runtime or dynamic relationships. The local Ollama model produced some omitted or malformed semantic records; only valid, in-scope Graphify records were retained. See `unresolved-relationships.md`.
