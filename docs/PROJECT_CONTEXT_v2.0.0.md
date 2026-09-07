# SU2QC project context v2.0.0

Status: `BLOCKED — OTP template/custom SMTP gate`
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

Migration `006_v2_0_0_people_vault_otp.sql` was applied remotely as migration `20260907192755`. It creates the RLS-enabled `public.member_emails` alias table, backfills existing member emails, adds `materials.visibility` and `updated_at`, creates the safe public/member views, limits grants, and keeps the `materials` bucket private. Remote counts after provisioning are seven members, eight aliases, eight Auth users, and zero materials; no private row values are recorded here.

The remote Auth project has public signup disabled, OTP length set to six, and OTP expiry set to 600 seconds. The hosted free-tier default email provider rejected the required Magic Link template update because OTP template customization requires custom SMTP or a paid/configured provider. The template still needs the dashboard/template value containing `{{ .Token }}` before real OTP delivery can be tested. Do not claim production readiness or deploy until this gate passes.

## Trusted backend

- `materials-upload`: authenticated upload, alias membership, visibility acknowledgement, metadata parsing, content validation, and compensating object cleanup.
- `materials-download`: signed URL issuance for public Library material or active-member Vault material; private bucket remains private.
- `materials-manage`: authenticated GET/PATCH/PUT/DELETE management path with server-derived ownership/admin authorization, replacement cleanup, archive/restore, visibility acknowledgement, and no client-supplied owner authority.
- Shared validators reject unsafe filenames, wrong MIME/extension pairs, empty or oversized files, bad signatures, binary text, invalid notebook JSON, and unsupported formats. Malware scanning is not included.

## Verification

Passing local gates: `npm test` 30/30, `npm run lint`, and `NEXT_PUBLIC_SITE_URL=https://su2qc.github.io npm run build`. The layout script now covers eight routes at 390, 768, 1024, and 1440 pixels; a final local-browser run remains required after the clean build.

Remote migration, private bucket, RLS, Auth provisioning counts, and security/performance advisors were inspected. The pre-existing leaked-password-protection warning remains dashboard/plan dependent. The new `member_emails` table intentionally has RLS with no client policy or grant; trusted functions use the service client.

## Next session commands

```bash
cd /home/digonto/Codes/Github_repos/SU2QC_starter_v1.0.0
git --git-dir=.release-git/.git --work-tree=. status --short --branch
npm test && npm run lint
NEXT_PUBLIC_SITE_URL=https://su2qc.github.io npm run build
SU2QC_BASE_URL=http://127.0.0.1:4173 npm run check:layout
```

Before any deployment: configure custom SMTP or an eligible Supabase email provider, set the Auth Magic Link template to include `{{ .Token }}`, verify six-digit real delivery to one operator mailbox, deploy the three changed Edge Functions, run authenticated/anonymous browser denial and cleanup fixtures, refresh Graphify and the Obsidian notes, then commit/push source and publish only the clean tested `out/` tree.
