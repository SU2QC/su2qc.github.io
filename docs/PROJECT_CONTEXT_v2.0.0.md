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

Publication complete: source `e9f7863d8b2d6a2d0ce5f879d6380cbab0e68dfb` is on organization `main`, exact tested `out/` is on Pages commit `6ffce1670209152666ae134afa74e3c29ff88c49`, live routes returned 200, and the private backup was updated and restore-checked.
