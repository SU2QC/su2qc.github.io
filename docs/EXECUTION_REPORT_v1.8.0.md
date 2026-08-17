# SU2QC v1.8.0 production-operations and knowledge-graph gate

Date: 2026-08-17  
Repository: `SU2QC/su2qc.github.io`  
Production: https://su2qc.github.io/  
Supabase project ref: `zvhachktcgnkxwtdxucj`

## Executive result

`SU2QC V1.8.0 PRODUCTION OPERATIONS AND KNOWLEDGE GRAPH GATE: BLOCKED`

The application baseline, Supabase read-only audit, live-site checks, local tests, static build, and security scans passed. The gate is blocked at the complete Graphify prerequisite: the installed Graphify 0.9.30 tool found the first-party corpus, but its local Ollama backend lacks the `openai` package required by Graphify and SQL extraction lacks `tree_sitter_sql`. The prompt prohibits installing missing dependencies during this run. No fabricated graph, vault, mapping, or Canvas was created.

Required operator repair command, to run later from this repository environment:

```bash
uv tool install --force 'graphifyy[ollama,sql]'
```

Then rerun the documented Graphify command in the v1.8.0 prompt with the local `qwen2.5-coder:7b` Ollama backend. The exact failed invocation was:

```bash
graphify extract .codex-tmp/graphify-input-v18 \
  --out .codex-tmp/graphify-out-v18 \
  --no-gitignore --backend=ollama --model=qwen2.5-coder:7b \
  --max-concurrency=1 --api-timeout=120
```

## Evidence classification

- Operator evidence: Supabase Dashboard facts supplied in the v1.8.0 prompt.
- MCP evidence: project URL, migration history, Edge Function status, advisors, and aggregate SQL checks below.
- Local evidence: tests, lint, static build, route checks, scans, and Graphify prerequisite diagnostics.
- Prior browser evidence: the v1.7.0 report; no new browser fixture was created because runtime behavior was unchanged.
- Static analysis evidence: source checks, static output checks, Impeccable detect, and Graphify tool discovery.

## Operator-verified Supabase settings

The repository owner attested these Dashboard values; MCP cannot independently read them:

- Site URL: `https://su2qc.github.io/` — `OPERATOR-VERIFIED`.
- Production redirect allowlist contains `https://su2qc.github.io/**` — `OPERATOR-VERIFIED`.
- Public email signup disabled — `OPERATOR-VERIFIED`.
- Email/password sign-in enabled for existing users — `OPERATOR-VERIFIED`.
- Plan is Supabase Free — `OPERATOR-VERIFIED`.
- Leaked-password protection classification: `ACCEPTED — PLAN-GATED`.

The security advisor warning remains visible. No unsupported SQL, policy, hook, or client-side workaround was attempted.

## Baseline and v1.7.0 closure

- Effective release Git metadata: `.release-git/.git`; the top-level `.git` is absent.
- Fetch and push remotes both resolve to `https://github.com/SU2QC/su2qc.github.io.git`; no personal fork was used.
- Initial main: `b1e93a0eea0dce6e40243d7942e6151205a716c6` (`Record exact v1.7.0 deployment commit`).
- Initial deployed `gh-pages`: `b173a8fa1638512b7888ee60b1eda7ea840d7d05`.
- Live `/`, `/research/`, `/people/`, `/library/`, `/login/`, `/upload/`, and `/favicon.ico`: HTTP `200`.
- v1.7.0 source fixes remain present: checked-in favicon and metadata, stable form reference across the awaited upload, narrow generated-output ESLint ignores, favicon regression coverage, and async form-reset regression coverage.
- Prior v1.7.0 report recorded 26/26 tests, clean lint, successful build, browser upload/download/denial/hash/cleanup, and a restored production baseline of 3 materials and 3 private objects for `Md Habib E Islam Digonto`.

## Supabase MCP audit

The project URL returned by `get_project_url` was `https://zvhachktcgnkxwtdxucj.supabase.co`, matching ref `zvhachktcgnkxwtdxucj` exactly.

Read-only MCP results:

- Migration history: the three v1.4 migrations plus `20260816205504 v1_6_0_security_hardening`; no migration was applied or re-applied.
- `materials-upload`: `ACTIVE`, version 1.
- `material-download`: `ACTIVE`, version 1.
- Active approved member aggregate for `misla004@odu.edu`: `1`.
- Materials aggregate: `3` rows; private materials storage aggregate: `3` objects; bucket remains private.
- Anonymous and authenticated execution of `public.rls_auto_enable()` remains disabled.
- Security advisor: only `auth_leaked_password_protection` remains at `WARN`; classified `ACCEPTED — PLAN-GATED` from operator-confirmed Free plan evidence.
- Performance advisor: four `auth_rls_initplan` warnings and the informational unused `materials_member_id_idx` warning remain. No change was made because the reviewed live security migration is already applied and the index remains part of the ownership-query design.

No private row contents, credentials, bearer tokens, service keys, signed URLs, or environment values were printed.

## Graphify prerequisite and coverage gate

Graphify was found at `/home/digonto/.local/bin/graphify`, version `0.9.30`, backed by its uv-managed Python environment. The committed repository snapshot staged under `.codex-tmp/graphify-input-v18` contained 66 files. With `--no-gitignore`, Graphify detected 45 code files, 9 documents, 1 paper, and 6 images; 4 files were unclassified (`.env.example`, `.gitignore`, `app/favicon.ico`, and `app/globals.css`).

The full authentic extraction stopped with two dependency errors:

1. Five SQL files contributed no graph nodes because `tree_sitter_sql` is not installed.
2. The Ollama semantic chunk failed because the Graphify environment lacks the `openai` package required by its Ollama backend; all 16 semantic files were therefore absent from the graph.

The existing ignored `graphify-out/` was not reused as v1.8 output because it predates this gate and includes out-of-scope agent material. A code-only or hand-authored supplement would not satisfy the required complete Graphify graph, so no `docs/codebase-graph/` artifact was created.

Graph statistics, 100% first-party coverage, dangling-edge validation, native GraphML/JSON export, unresolved-relationship report, and final-commit graph metadata are **not available** until the operator runs the repair command and reruns Graphify successfully.

## Obsidian and Canvas gate

No `docs/obsidian-vault/`, Graphify-to-note mapping, wiki-link validator, or Obsidian Canvas was created. Generating any of these without authentic Graphify output would violate the source-of-truth requirement. Note count, node mapping, backlink, Canvas-link, and portability results are therefore **BLOCKED by the Graphify prerequisite**.

## Local regression validation

- `npm test`: PASS, 26/26.
- `npm run lint`: PASS, zero errors and zero warnings.
- `NEXT_PUBLIC_SITE_URL=https://su2qc.github.io npm run build`: PASS with Next.js 16.3.1; routes statically prerendered.
- Plain static server: all six application routes and `/favicon.ico` returned HTTP `200`.
- `out/favicon.ico`: valid Windows ICO with 4 icons (16, 32, 48, and 64 pixel variants).
- Static and source secret scans: PASS; no service-role assignments, bearer-token values, private keys, or secret-key values found.
- `npx impeccable detect --json app components`: PASS, `[]`.
- `impeccable doctor`: unavailable in the installed CLI; `impeccable --help` exposes no `doctor` command. No installation was attempted.
- Responsive/layout runner: BLOCKED by the host because Chrome DevTools did not start at `http://127.0.0.1:9223/json/list`. Prior v1.7.0 responsive and browser evidence remains recorded in the v1.7.0 report.
- No type-check script is configured in `package.json`.

## Git, deployment, and cleanup

This v1.8.0 change is documentation-only and prerequisite-reporting only; no public website source changed, so no `gh-pages` update was necessary. The intended v1.8.0 report is the only release change. No custom GitHub Actions workflow was created. The user-supplied untracked execution prompt was preserved and not added as a public source file.

No production fixture was created in this run. The live production baseline remained the previously verified 3 materials and 3 private storage objects. Disposable Graphify staging was kept only under ignored `.codex-tmp/` until final cleanup.

The final main commit and clean-worktree status are recorded in the final handoff after the report commit. The `gh-pages` commit remains `b173a8fa1638512b7888ee60b1eda7ea840d7d05`; no Pages deployment was needed.

No password, token, credential, signed URL, authorization header, secret, or private environment value was printed, retained, or committed.
