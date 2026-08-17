# SU2QC Graphify 0.9.45 report

This report describes the authentic Graphify extraction and merge after validation. Graphify-native node IDs are preserved. Out-of-scope or malformed model records are counted in `unresolved-relationships.md` and are not repaired.

- Source commit: `44845fd7b50baf7f794edcb89ba908c4dd0ae8dd`
- Nodes: 265; edges: 348; hyperedges: 2; communities: 32.
- Edge provenance: EXTRACTED=344, INFERRED=4.
- Graphify input: 66 included files; 8 documented exclusions.

## Node types

- code: 201
- concept: 23
- document: 31
- image: 6
- paper: 4

## Edge types

- calls: 59
- conceptually_related_to: 4
- contains: 140
- imports: 63
- imports_from: 44
- indirect_call: 4
- method: 1
- references: 33

## Source coverage

| Repository file | Graph nodes |
|---|---:|
| `DESIGN.md` | 1 |
| `PRODUCT.md` | 1 |
| `README.md` | 1 |
| `app/layout.js` | 5 |
| `app/library/page.js` | 3 |
| `app/login/page.js` | 3 |
| `app/page.js` | 3 |
| `app/people/page.js` | 3 |
| `app/research/page.js` | 4 |
| `app/upload/page.js` | 4 |
| `components/library-list.js` | 3 |
| `components/login-form.js` | 3 |
| `components/section-intro.js` | 2 |
| `components/site-footer.js` | 2 |
| `components/site-header.js` | 3 |
| `components/upload-form.js` | 4 |
| `data/people.js` | 3 |
| `docs/EXECUTION_REPORT_v1.6.0.md` | 1 |
| `docs/EXECUTION_REPORT_v1.6.1.md` | 1 |
| `docs/EXECUTION_REPORT_v1.6.2.md` | 5 |
| `docs/EXECUTION_REPORT_v1.7.0.md` | 1 |
| `docs/EXECUTION_REPORT_v1.8.0.md` | 1 |
| `docs/EXECUTION_REPORT_v1.8.1.md` | 3 |
| `docs/EXECUTION_REPORT_v1.8.2.md` | 4 |
| `docs/PROJECT_CONTEXT_v1.8.2.md` | 13 |
| `docs/QA_CHECKLIST.md` | 2 |
| `docs/SOURCES.md` | 14 |
| `docs/UPLOAD_GUIDE.md` | 6 |
| `eslint.config.mjs` | 1 |
| `lib/bibtex.mjs` | 5 |
| `lib/material-validation.mjs` | 6 |
| `lib/rate-limit.mjs` | 3 |
| `lib/safe-next.mjs` | 3 |
| `lib/supabase/auth.js` | 2 |
| `lib/supabase/client.js` | 2 |
| `lib/supabase/config.js` | 6 |
| `lib/upload-status.mjs` | 4 |
| `next.config.mjs` | 2 |
| `package.json` | 33 |
| `public/images/investigators/kwangmin-yu.jpeg` | 1 |
| `public/images/investigators/paulo-f-bedaque.jpg` | 1 |
| `public/images/investigators/raza-sabbir-sufian.png` | 1 |
| `public/images/investigators/taku-izubuchi.jpg` | 1 |
| `public/images/su2qc-hero.png` | 1 |
| `public/images/su2qc-logo.png` | 1 |
| `scripts/check-stacked-headings.mjs` | 6 |
| `scripts/docs-graph.mjs` | 26 |
| `supabase/functions/_shared/bibtex.js` | 4 |
| `supabase/functions/_shared/download-handler.js` | 2 |
| `supabase/functions/_shared/http.js` | 6 |
| `supabase/functions/_shared/material.js` | 9 |
| `supabase/functions/_shared/upload-handler.js` | 5 |
| `supabase/functions/material-download/index.js` | 6 |
| `supabase/functions/materials-upload/index.js` | 6 |
| `supabase/migrations/001_initial.sql` | 3 |
| `supabase/migrations/002_live_supabase_bootstrap.sql` | 2 |
| `supabase/migrations/003_v1_4_0_live_supabase_grant_hardening.sql` | 1 |
| `supabase/migrations/004_v1_4_0_live_supabase_fk_hardening.sql` | 1 |
| `supabase/migrations/005_v1_6_0_security_hardening.sql` | 1 |
| `tests/bibtex.test.mjs` | 1 |
| `tests/edge-functions.test.mjs` | 6 |
| `tests/material-validation.test.mjs` | 2 |
| `tests/repository.test.mjs` | 3 |
| `tests/safe-next.test.mjs` | 1 |
| `tests/supabase-config.test.mjs` | 1 |
| `tests/upload-status.test.mjs` | 1 |

## Limitations

Static AST extraction cannot prove runtime or dynamic relationships. The local Ollama model produced some omitted or malformed semantic records; only valid, in-scope Graphify records were retained. See `unresolved-relationships.md`.
