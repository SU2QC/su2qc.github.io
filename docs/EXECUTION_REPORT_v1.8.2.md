# SU2QC v1.8.2 final graph, deployment, backup, and context gate

Date: 2026-08-17
Repository: `SU2QC/su2qc.github.io`
Production: https://su2qc.github.io/
Supabase project ref: `zvhachktcgnkxwtdxucj`

## Executive result

`SU2QC V1.8.2 FINAL GRAPH, DEPLOYMENT, BACKUP, AND CONTEXT GATE: IN PROGRESS`

This substantive report records the completed local and read-only gates. Final remote commit IDs, Pages deployment evidence, personal-backup commit, restore check, and shutdown determination are filled during deterministic finalization.

## Inherited and new work

Inherited from v1.8.1: Graphify 0.9.45/Ollama setup, the corrected Paulo F. Bedaque public derivative, investigator mapping tests, Graphify/vault validators, local application gates, and the read-only Supabase baseline. This run added generated-graph exclusion and bounded semantic-retry handling to `scripts/docs-graph.mjs`, refreshed the authentic graph/vault, and created the project context and backup manifest.

No migration, Auth user, password, approved-member field, role, active status, ownership, RLS policy, grant, Storage object, Edge Function, or production upload fixture was changed. No shutdown, reboot, poweroff, or equivalent command was run.

## Graphify gate

- Version: `0.9.45` exactly; no stale skill warning.
- Backend: local Ollama `0.30.10`, model `qwen2.5-coder:7b`, concurrency 1, API timeout 120 seconds.
- Environment: localhost Ollama reachable; `openai` and `tree_sitter_sql` imports passed.
- Smoke: the prior JavaScript/SQL/Markdown smoke gate passed; this run used the authentic CLI for the full extraction.
- Scope: 64 included first-party files (46 code, 11 Markdown, 1 paper, 6 public images) and 7 documented exclusion entries/patterns. Generated graph and vault directories are explicitly removed from the staged extraction input.
- Result: 242 nodes, 333 valid edges, 2 hyperedges, 30 communities; 195 code, 16 concept, 25 document, and 6 image nodes; 329 `EXTRACTED` and 4 `INFERRED` edges.
- Coverage: 64/64 included files represented; zero dangling endpoints; generated graph/vault source count 0.
- Raw merge: 276 nodes and 364 edges; 34 nodes and 31 edges discarded as malformed or out of declared scope. No relationships were invented.
- Artifacts: `docs/codebase-graph/graph.json`, `graph.html`, `graph.graphml`, `GRAPH_REPORT.md`, `statistics.json`, `generation-metadata.json`, `included-files.json`, `exclusions.json`, and `unresolved-relationships.md`.
- Limitation: local semantic extraction can return malformed or omitted records and cannot prove dynamic runtime relationships. Long documents use bounded source-preserving retries and omissions remain visible in metadata.

Commands: `npm run docs:graph`, `npm run docs:graph:validate`.

## Obsidian gate

- Vault: `docs/obsidian-vault/`.
- Graphify nodes mapped: 242/242.
- Notes: 279, including `SU2QC Codebase Map.md` and 25 subsystem notes.
- Canvas: `SU2QC Architecture.canvas`; the Auth/member/authorization/upload/private-storage/library/signed-download and people/assets/static-export/Pages flows are represented.
- Wiki links, map backlinks, Canvas file paths, secret scan, and absolute-path checks: PASS.
- Validation command: `npm run docs:obsidian:validate`.

## Investigator-image gate

| Investigator | Source | Emitted asset | Dimensions | Local/live emitted SHA-256 |
|---|---|---|---:|---|
| Kwangmin Yu | `source_image/Kwangmin Yu.jpeg` | `public/images/investigators/kwangmin-yu.jpeg` | 400x400 | `5d821cd8bb96a0ca17005c844ec63af9bb8e4f7b6d0223276b2346a9e66dff65` |
| Paulo F. Bedaque | `source_image/Paulo F. Bedaque.jpg` | `public/images/investigators/paulo-f-bedaque.jpg` | 190x251 | `c76ed184218ce40836f6d9ed2b833b4cc342f8ced283d7944bb11eeff047dc8a` |
| Raza Sabbir Sufian | `source_image/Raza Sabbir Sufian.png` | `public/images/investigators/raza-sabbir-sufian.png` | 200x300 | `def1b8d663fabce1960c9af6d24a52dc41e2ea585d46767374bffab397e99ab8` |
| Taku Izubuchi | `source_image/Taku Izubuchi.jpg` | `public/images/investigators/taku-izubuchi.jpg` | 120x160 | `9cbd5836303be93305442835f130b94d0831cb529714b0cf480fbd0cb0f7b9d6` |

All source files exist, mappings are unique, formats are supported, names/titles/affiliations/alt text are present, and the live emitted bytes match local emitted bytes. Paulo remains the corrected resized derivative; it is not replaced or regenerated. The 24 responsive people-page checks found no stretch, important crop, overflow, broken request, or duplicate assignment.

## Supabase read-only gate

- URL matched the required project ref: `https://zvhachktcgnkxwtdxucj.supabase.co` / `zvhachktcgnkxwtdxucj`.
- Remote migration identities matched the four local applied migrations listed in the project context.
- Read-only schema inspection confirmed RLS-enabled `public.members` and `public.materials`, private Storage configuration, and the expected metadata constraints.
- Active Edge Functions: `materials-upload` and `material-download`.
- The operator-specified approved member identity was confirmed without reporting private row contents.
- No production fixture was created because runtime authentication/upload/database/Edge Function/Storage behavior did not change; therefore no row/object residue delta exists.
- Security advisor: `auth_leaked_password_protection` WARN, retained as `ACCEPTED — PLAN-GATED` because the plan/dashboard state is not independently readable here.
- Performance: prior read-only snapshot retains four RLS initialization-plan warnings and one informational unused-index notice. No remediation was applied.

## Local and production gates

- `npm test`: PASS, 27/27.
- `npm run lint`: PASS, zero ESLint errors/warnings.
- `NEXT_PUBLIC_SITE_URL=https://su2qc.github.io npm run build`: PASS on Next.js 16.3.1; static routes prerendered. No standalone type-check command exists, so no separate type-check PASS is claimed.
- `SU2QC_BASE_URL=http://localhost:3000 npm run check:layout`: PASS, 24 route/viewport checks at 390, 768, 1024, and 1440 pixels.
- Browser page/route checks: required public routes and assets returned HTTP 200; emitted investigator hashes matched live bytes.
- Repository Impeccable doctor: PASS with no drift. Broad detect output is not used as a product-design PASS because it scans generated Graphify HTML and ignored build output; those findings are third-party/generated visualization or Next fallback markup, not application UI. The academic design skill was preserved; no design pass was needed.
- Static source tests cover route existence, image mapping/uniqueness/alt text, security boundaries, and upload validation.
- Production authenticated upload/download fixture: SKIPPED by rule because runtime behavior was unchanged; prior genuine browser evidence remains the applicable runtime baseline.

## Size and secret policy

- Effective release Git tracked files before this run: 298.
- Tracked bytes before finalization: 2,693,601; Git pack: approximately 1.91 MiB.
- Largest tracked file before new docs: `public/images/su2qc-hero.png` at 722,137 bytes; no tracked file is at or above 10 MiB, 50 MiB, or 100 MiB.
- `git-lfs/3.5.1` is installed; no candidate needs LFS and LFS is not used in organization source or `gh-pages`.
- The Pages export is approximately 3.1 MiB; its largest files are the public hero/logo and static JS chunks, all far below the 1 GiB Pages constraint.
- Secret scans cover source, generated graph/vault, static export, reports, and backup snapshot. No password, environment value, service-role key, JWT, bearer token, refresh token, cookie, signed query string, private object, database dump, or authenticated browser profile is intended or present.
- Prompt files are operator inputs and are not public source files.

## Project context and manifest

- `docs/PROJECT_CONTEXT_v1.8.2.md`: created as the future-session handoff with architecture, flows, commands, security invariants, graph/vault, deployment, backup, limitations, and disaster recovery.
- `docs/BACKUP_MANIFEST_v1.8.2.json`: created as a secret-free curated snapshot manifest; exact final commit and restore evidence are filled after backup finalization.

## Organization source, Pages, and personal backup

These fields are intentionally pending until the final deterministic sequence completes:

- Organization source content commit: pending.
- Organization final report-only commit: pending.
- Organization `main` remote match: pending.
- Organization `gh-pages` commit/deployment run: pending; local export differs from remote and is eligible for publication.
- Personal backup repository/commit/push: pending; repository creation is permitted only under `digonto10602` and must remain private.
- Fresh backup clone/restore check: pending.

## Cleanup and shutdown readiness

The run creates disposable material only under `.codex-tmp/`; pre-existing ignored material is preserved. Before finalization, exact run-created directories, local servers, browser profiles, and processes are removed or stopped. The final report will state the clean worktree, all remote heads, production verification, artifact presence, and whether shutdown is safe. No shutdown command is permitted.

## Authoritative documentation

- `README.md`, `DESIGN.md`, `PRODUCT.md`, `docs/SOURCES.md`, `docs/UPLOAD_GUIDE.md`
- `docs/EXECUTION_REPORT_v1.8.0.md`, `docs/EXECUTION_REPORT_v1.8.1.md`, this report
- `docs/codebase-graph/` and `docs/obsidian-vault/`
- `docs/BACKUP_MANIFEST_v1.8.2.json`
