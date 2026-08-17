# SU2QC v1.8.1 Graphify, Obsidian, investigator-image, and audit-completion gate

Date: 2026-08-17
Repository: `SU2QC/su2qc.github.io`
Production: https://su2qc.github.io/
Supabase project ref: `zvhachktcgnkxwtdxucj`

## Executive result

`SU2QC V1.8.1 GRAPHIFY, OBSIDIAN, AND INVESTIGATOR IMAGE GATE: PASS`

The authentic Graphify 0.9.45 extraction, semantic recovery retries, graph integrity validation, repository-contained Obsidian vault, Canvas validation, investigator-image audit, local regression gates, live image checks, and read-only Supabase advisor snapshot all completed. No production upload fixture was created because application authentication, upload, database, Edge Function, and storage behavior did not change.

## Scope and safety

- The supplied `docs/SU2QC_CODEX_PROMPT_v1.8.1.md` was the executable specification; this report was created because the requested report file did not exist.
- The shutdown/reboot requirement is revoked and no power, shutdown, reboot, or halt command was run.
- No migration was edited or reapplied. No Auth user, password, approved member, role, active status, ownership, storage object, RLS policy, grant, or Edge Function was changed.
- No password, token, JWT, bearer value, signed URL query string, service key, private environment value, or authenticated browser profile was printed, retained, or committed.
- Disposable Graphify staging, Ollama extraction outputs, browser profiles, live downloads, and browser evidence were kept under `.codex-tmp/` and removed before final commit.

## Phase 1 — repository and release Git

- Effective release metadata: `.release-git/.git`; the checkout root has no `.git` directory.
- Fetch and push remotes resolve only to `https://github.com/SU2QC/su2qc.github.io.git`.
- Initial main commit for this gate: `7af95d6140552c38f19a61714e95298cc081689b` (`Update Paulo Bedaque portrait`).
- Initial remote `gh-pages` commit: `7bb768760ac5b8a76e22c3ffd8574996a7969a33`.
- `graphify hook status`: `Not in a git repository`, a known limitation of the nested release-Git layout; no hook was installed or modified.
- All live routes returned HTTP 200: `/`, `/research/`, `/people/`, `/library/`, `/login/`, `/upload/`, and `/favicon.ico`.
- The corrected Paulo public asset is already in the initial main commit and remote `main`; the live asset check below confirms deployment.

## Phase 2 — Graphify prerequisite and smoke gate

- `graphify --version`: `0.9.45`.
- The project-scoped `.codex/skills/graphify/SKILL.md` and installed Graphify Codex skill are aligned with the 0.9.45 interface. No `skill is from graphify 0.9.30` warning appeared.
- `ollama --version`: `0.30.10`.
- Local Ollama API: reachable at `127.0.0.1:11434`.
- `ollama show qwen2.5-coder:7b`: PASS.
- Graphify environment imports: `openai`: PASS; `tree_sitter_sql`: PASS.
- Controlled JavaScript/SQL/Markdown smoke extraction: PASS; Graphify produced 5 nodes, 2 edges, and 3 communities with JavaScript, SQL, and semantic Markdown representation.
- The expected local-server warning about an unset `OLLAMA_API_KEY` was observed; no key is required for the local Ollama endpoint and none was requested or stored.

## Phase 3 — corpus manifest and 66-versus-65 reconciliation

The final first-party Graphify scope was staged from the release Git `HEAD`, excluding generated output, temporary evidence, environment values, Git internals, and unsupported binary/style files.

| Classification | Count |
|---|---:|
| Code | 45 |
| Markdown documents | 10 |
| Paper/source document | 1 |
| Images | 6 |
| Graphify-supported included files | 62 |
| Explicit exclusions | 5 |
| Release-Git tracked files represented by the arithmetic | 67 |

The v1.8.0 report’s 66-file staged corpus was classified as 45 code + 9 documents + 1 paper + 6 images + 4 unclassified = 65. The exact missing count was `package-lock.json`, which Graphify did not classify and which was not in the four printed unclassified names. Current `HEAD` contains one additional operational document, `docs/EXECUTION_REPORT_v1.8.0.md`, so the document count is now 10 and the tracked total is 67. The exact manifests are committed in `docs/codebase-graph/included-files.json` and `docs/codebase-graph/exclusions.json`.

Excluded files and reasons:

- `.env.example`: unsupported example environment file.
- `.gitignore`: repository metadata instructions, not a source module.
- `app/favicon.ico`: binary ICO audited separately; unsupported by Graphify.
- `app/globals.css`: unsupported CSS classification; covered by source and visual tests.
- `package-lock.json`: dependency lockfile excluded while `package.json` and the installed dependency graph remain included.

The ignored `source_image/` originals were audited in Phase 8 but are not release-Git first-party graph inputs; the emitted `public/images/investigators/` assets are the included image scope.

## Phase 4 — authentic Graphify extraction

The extraction used the installed Graphify CLI, Ollama backend, model `qwen2.5-coder:7b`, maximum concurrency 1, API timeout 120 seconds, and a bounded 8,000-token semantic chunk budget. The first pass omitted semantic files and returned malformed model records; it was not promoted. The same authentic CLI was then used for per-file retries of `docs/EXECUTION_REPORT_v1.6.0.md` and `docs/EXECUTION_REPORT_v1.6.1.md`, followed by Graphify’s native `merge-graphs` command.

Final validated graph statistics:

- Graph nodes: 193.
- Valid edges: 271.
- Hyperedges: 2.
- Communities: 28.
- Node types: 164 code, 13 concept, 10 document, 6 image.
- Edge types: 36 calls, 4 conceptually related, 111 contains, 63 imports, 44 imports-from, 4 indirect calls, 1 method, 5 references, 3 shares-data-with.
- Provenance: 267 `EXTRACTED`, 4 `INFERRED`.
- Included-file coverage: 62/62; every included file maps to at least one node.
- Raw merged output: 221 nodes and 296 edges. The validator discarded 28 out-of-scope or malformed nodes and 25 invalid edges; it invented no relationships.
- No dangling endpoints remain. Node IDs are unique. SQL nodes exist for all five included migrations, and semantic nodes exist for all included documents and images.

Artifacts:

- `docs/codebase-graph/graph.json`
- `docs/codebase-graph/graph.html`
- `docs/codebase-graph/graph.graphml`
- `docs/codebase-graph/GRAPH_REPORT.md`
- `docs/codebase-graph/statistics.json`
- `docs/codebase-graph/generation-metadata.json`
- `docs/codebase-graph/included-files.json`
- `docs/codebase-graph/exclusions.json`
- `docs/codebase-graph/unresolved-relationships.md`

Limitations are recorded rather than hidden: static extraction cannot prove dynamic runtime relationships, and local semantic model output can omit or misattribute records. The exact discard counts and samples are in `unresolved-relationships.md`.

Regeneration and validation commands:

```bash
npm run docs:graph
npm run docs:graph:validate
npm run docs:obsidian:validate
```

`npm run docs:graph` uses the actual Graphify CLI and local Ollama backend. It stages release-Git `HEAD`, retries missing semantic files individually, merges native Graphify JSON, exports HTML and GraphML, and generates the repository-contained vault.

## Phases 6–7 — Obsidian vault and Canvas

Vault path: `docs/obsidian-vault/`.

- Markdown notes: 218.
- Graphify nodes mapped: 193/193.
- Mapping file: `Graphify node mapping.json`.
- Every graph node has a dedicated note with Graphify ID, source path, node type, symbols, incoming/outgoing dependencies, responsibilities, security relevance, related wiki links, and source commit.
- The map-of-content is `SU2QC Codebase Map.md`.
- All 25 required subsystem notes exist and link back to the map.
- Every internal wiki link resolves; all node notes and subsystem notes have map backlinks.
- Canvas: `SU2QC Architecture.canvas`, valid JSON with 7 groups, 18 file nodes, and 11 edges.
- Canvas covers the Auth/member/Edge Function/private-storage/library/signed-download chain and the people-assets/static-export/Pages chain.
- Canvas file links resolve to existing vault notes.
- Graph-to-note, wiki-link, Canvas, secret, and absolute-path validation: PASS.

## Phase 8 — investigator-image audit

| Investigator | Source image | Source dimensions | Emitted asset | Emitted dimensions | Local/live emitted SHA-256 |
|---|---|---:|---|---:|---|
| Kwangmin Yu | `source_image/Kwangmin Yu.jpeg` | 400×400 JPEG | `public/images/investigators/kwangmin-yu.jpeg` | 400×400 JPEG | `5d821cd8bb96a0ca17005c844ec63af9bb8e4f7b6d0223276b2346a9e66dff65` |
| Paulo F. Bedaque | `source_image/Paulo F. Bedaque.jpg` | 150×225 JPEG | `public/images/investigators/paulo-f-bedaque.jpg` | 190×251 JPEG | `c76ed184218ce40836f6d9ed2b833b4cc342f8ced283d7944bb11eeff047dc8a` |
| Raza Sabbir Sufian | `source_image/Raza Sabbir Sufian.png` | 200×300 PNG | `public/images/investigators/raza-sabbir-sufian.png` | 200×300 PNG | `def1b8d663fabce1960c9af6d24a52dc41e2ea585d46767374bffab397e99ab8` |
| Taku Izubuchi | `source_image/Taku Izubuchi.jpg` | 120×160 JPEG | `public/images/investigators/taku-izubuchi.jpg` | 120×160 JPEG | `9cbd5836303be93305442835f130b94d0831cb529714b0cf480fbd0cb0f7b9d6` |

- All four source portraits were visually inspected and are distinct.
- All four public mappings are unique, supported formats, present, and have nonempty alt text.
- Kwangmin, Raza, and Taku preserve identical source/emitted bytes. Paulo’s corrected public image is a resized/transformed derivative, intentionally distinct from the ignored source original.
- The Paulo correction is in commit `7af95d6140552c38f19a61714e95298cc081689b`; local `out/`, local static serving, and live `https://su2qc.github.io/people/` all serve the same emitted Paulo bytes.
- Live `/people/` contains all four expected image paths and all four investigator names.
- Responsive people-page checks at 390, 768, 1024, and 1440 pixels found no stretched image, broken image, important face crop, horizontal overflow, or layout failure.
- Source-asset existence, unique assignment, supported format, and alt-text regression coverage is in `tests/repository.test.mjs`.

## Phase 9 — Impeccable, responsive, accessibility, and browser gates

- Repository Impeccable detect: PASS, zero findings.
- Repository Impeccable doctor script: PASS, zero findings; rule registry available.
- Responsive runner repaired to use an available CDP port and fresh `.codex-tmp` Chrome profile, then cleanly terminate and remove it.
- Responsive layout: PASS, 24 route/viewport checks across six routes and 390/768/1024/1440 widths.
- Browser page/console gate: PASS; zero page errors, zero console errors, zero broken image requests, one H1 per route, and no horizontal overflow.
- Accessibility source/DOM checks: PASS for skip link, focus-visible styling, reduced-motion handling, labels, live regions, semantic headings, and 44px controls.
- No design changes were made; the existing academic visual direction was preserved.

## Phase 10 — local regression

- `npm test`: PASS, 27/27.
- `npm run lint`: PASS, zero ESLint errors and warnings.
- `NEXT_PUBLIC_SITE_URL=https://su2qc.github.io npm run build`: PASS with Next.js 16.3.1; all static routes prerendered.
- Static output checks: PASS for `/`, `/research/`, `/people/`, `/library/`, `/login/`, `/upload/`, and `/favicon.ico`.
- Emitted investigator assets: PASS; four files present and hashes recorded above.
- Graph, graph-to-Obsidian, wiki-link, Canvas, documentation-secret, and portability validators: PASS.
- TypeScript: Next.js build completed its built-in TypeScript stage, but no standalone repository type-check script is configured; no separate `type-check` PASS is claimed.

## Phase 11 — Supabase read-only snapshot

- Project URL: `https://zvhachktcgnkxwtdxucj.supabase.co`, matching project ref `zvhachktcgnkxwtdxucj`.
- Applied migrations: `20260816165238 v1_4_0_live_supabase_bootstrap`, `20260816165437 v1_4_0_live_supabase_grant_hardening`, `20260816172657 v1_4_0_live_supabase_fk_hardening`, and `20260816205504 v1_6_0_security_hardening`.
- Security advisor: only `auth_leaked_password_protection` at WARN. It remains `ACCEPTED — PLAN-GATED` based on the prior operator-confirmed Supabase Free-plan setting; MCP cannot independently read the billing plan or Auth dashboard configuration.
- Performance advisor: four `auth_rls_initplan` warnings affecting the reviewed members/materials policies, plus informational unused index `materials_member_id_idx`.
- No policy, migration, index, grant, storage, or Auth change was made. The index was not dropped solely because the advisor reports no observed use.

## Git, deployment, and final handoff

- Initial main: `7af95d6140552c38f19a61714e95298cc081689b`.
- Initial/final `gh-pages` for this documentation-only gate: `7bb768760ac5b8a76e22c3ffd8574996a7969a33`; no Pages deployment was required.
- Final main commit, push result, and final clean-worktree state are recorded in the post-commit amendment to this report.
- Only the SU2QC organization remote is approved and will be used.
- Because only graph, Obsidian, tests, runner, package scripts, documentation, and report artifacts changed, no meaningless `gh-pages` update will be created.

## Remaining warnings and future work

- Supabase leaked-password protection remains plan-gated and dashboard-dependent.
- Supabase retains four RLS initialization-plan performance warnings and one informational unused-index notice.
- Graphify’s semantic model remains nondeterministic and can omit dynamic relationships; reruns must preserve the validator and unresolved-relationship accounting.
- Node’s module-type warnings from the existing mixed Supabase/Node module layout remain non-failing test warnings.
