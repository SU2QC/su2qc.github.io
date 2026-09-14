# SU2QC project context v2.0.0

Status: `PASS — v2.0.0 verified and published`
Date: 2026-09-07

## Release boundary

This checkout implements the v2 People, email-OTP, public Library, and private website Vault release locally. The repository uses `.release-git/.git` as its effective Git metadata; the root has no `.git`. Source remains `main`, and the existing manual Pages publication remains `gh-pages:/`.

The public Library is for published `visibility = 'library'` materials. The website Vault is for active members and `visibility = 'vault'` materials. `docs/obsidian-vault/` is internal code documentation and is unrelated to the website Vault.

## Application routes and assets

- Public: `/`, `/research/`, `/people/`, `/library/`.
- Member shells: `/login/`, `/upload/`, `/vault/`, `/my-materials/`.
- Vault and management shells are static and contain no private metadata at build time. Runtime requests require a Supabase Auth session and active membership.
- Md Habib E Islam Digonto is represented with the supplied 400x400 metadata-stripped WebP derivative at `public/images/people/md-habib-e-islam-digonto.webp`, plus four source-backed profile links.
- Juan Gil Fraile is represented with a `JG` initials placeholder because no reliably attributable official portrait was found; the NMSU directory link is recorded in `docs/SOURCES.md`.

## Auth and membership

The browser calls `signInWithOtp({ options: { shouldCreateUser: false } })` and verifies with `verifyOtp({ type: 'email' })`. The UI has email and code steps, paste support, generic allowlist-safe messaging, cooldown, resend, change-email, redirect protection, and session-expiry recovery.

Migration `006_v2_0_0_people_vault_otp.sql` was applied remotely as migration `20260907192755`; corrective migrations `007`, `008`, and `009` were then applied forward-only. They preserve private alias access through a restricted security-definer membership helper and align the Storage MIME allowlist with server validation. Remote counts are seven members, eight aliases, eight Auth users, and zero materials; no private row values are recorded here.

The remote Auth project has custom SMTP configured, public signup disabled, a six-digit OTP, 600-second expiry, and a Magic Link template containing `{{ .Token }}`. One real OTP was delivered and verified in the browser without recording the code.

## Trusted backend

- `materials-upload`: authenticated upload, alias membership, visibility acknowledgement, metadata parsing, content validation, and compensating object cleanup.
- `materials-download`: signed URL issuance for public Library material or active-member Vault material; private bucket remains private.
- `materials-manage`: authenticated GET/PATCH/PUT/DELETE management path with server-derived ownership/admin authorization, replacement cleanup, archive/restore, visibility acknowledgement, and no client-supplied owner authority.
- Shared validators reject unsafe filenames, wrong MIME/extension pairs, empty or oversized files, bad signatures, binary text, invalid notebook JSON, and unsupported formats. Malware scanning is not included.

## Verification

Passing local gates include `npm test` 33/33, `npm run lint`, the production build, responsive layout, Graphify/Obsidian validation, and the live browser acceptance. The temporary fixture was removed; no temporary rows or objects remain.

Remote migration, private bucket, RLS, Auth provisioning counts, and security/performance advisors were inspected. The pre-existing leaked-password-protection warning remains dashboard/plan dependent. The new `member_emails` table intentionally has RLS with no client policy or grant; trusted functions use the service client.

## Next session commands

```bash
cd /home/digonto/Codes/Github_repos/SU2QC_starter_v1.0.0
git --git-dir=.release-git/.git --work-tree=. status --short --branch
npm test && npm run lint
NEXT_PUBLIC_SITE_URL=https://su2qc.github.io npm run build
SU2QC_BASE_URL=http://127.0.0.1:4173 npm run check:layout
```

Publication complete: source `03581143b086b2fe11cfd284868aafe3cd8c68f5` is on organization `main`, exact tested `out/` is on Pages commit `6ffce1670209152666ae134afa74e3c29ff88c49`, live routes returned 200, and the private backup was updated and restore-checked.

## Current task handoff — 2026-09-14

Status: `PASS — v2.1.0 verified and published`

- Applied production migrations `v2_1_0_vault_member_read_rls`, `v2_1_0_vault_member_read_helper_grant`, and `v2_1_0_vault_member_display_name_read`: approved-member reads now use a membership-wide helper and shared display-name join policy; owner/admin update/delete authorization remains unchanged.
- Paulo privacy check: two Vault metadata rows, both with matching private Storage objects; no contents opened. This detail is intentionally not published elsewhere.
- New member provisioning completed idempotently through the server-side admin path: exactly one Auth identity, one active normal member, and one active alias; no admin role, public People entry, or email literal was added to committed public files.
- Research page was rewritten with original publication-safe copy and public sources added to `docs/SOURCES.md`; no private proposal material was used as a source.
- Two-member acceptance passed: cross-list, cross-download, anonymous/unapproved/revoked denial, and cross-member update/delete denial. Temporary identities, rows, aliases, and objects were removed.
- Release source commit: `8e01b741d2ff738aa8fecb42f39d0455d091bcb4`, tag `v2.1.0`; Pages commit: `5df666d73d97843f21d02af3896711117817e38e`.
- Current public routes returned HTTP 200. Responsive Chrome automation was attempted twice but remains environment-blocked because Chrome DevTools did not start; the static layout checker itself reports no code-level failures when a browser is available.
- Personal backup `digonto10602/su2qc-website-backup` was updated to commit `5861795fb48c39b9a5e90a816e8bbf7965b1aa1b` and contains no private Vault data, credentials, proposals, or prompts.

## v2.1.1 production-regression handoff — 2026-09-14

Status: `PARTIAL — production policy and public-client acceptance pass; affected-member browser confirmation required`

- Root cause: migration 012 allowed an approved identity to select all eight active `members` rows so `components/vault-list.js` and `app/upload/page.js` failed at `.maybeSingle()` with PostgREST `PGRST116` before rendering Vault metadata.
- Migration `013_v2_1_1_restore_single_member_resolution.sql` removes the broad authenticated `members` policy and recreates `materials_member` with a restricted security-definer display-name lookup. Materials RLS remains security-invoker; ownership/admin mutation rules are unchanged.
- Before repair, two fresh real-member public sessions each had a valid session/user, one active alias-to-member mapping, successful membership RPC, five visible Vault rows, and a successful signed download, but the member query returned eight rows and `PGRST116`.
- After repair, the same two fresh real-member public sessions each resolve one member row, list all five Vault items, and download an existing item with HTTP 200. Direct private Storage listing remains empty by policy; downloads remain short-lived signed responses.
- Live browser execution is still required before declaring final PASS: this managed environment denied Chrome network sockets, and the attempted browser reached only Chrome's offline page. No browser success is inferred from the passing public-client test.
- `tests/vault-public-client.test.mjs` exercises production through browser-role clients and is enabled explicitly with `SU2QC_LIVE_RLS_TEST=1`; its temporary Auth users, member rows, aliases, and material rows are exact-marker cleaned.
