# SU2QC v2.0.0 execution report

Date: 2026-09-07
Result: `BLOCKED`

## Completed

- Added the new People entries, public profile links, safe Juan `JG` placeholder, and a 400x400 metadata-stripped supplied-portrait derivative.
- Added OTP login UI, `/vault/`, `/my-materials/`, Vault/Library destination controls, explicit public acknowledgement, and owner/admin management actions.
- Added migration `006_v2_0_0_people_vault_otp.sql` and applied it remotely as `20260907192755`.
- Provisioned/merged seven member identities, eight aliases, and eight Auth identities without recording private rows or sending collaborator invitations.
- Kept the private `materials` bucket private and changed public metadata filtering to published Library material only.

## Evidence

- `npm test`: PASS, 30/30.
- `npm run lint`: PASS.
- Static build: PASS with Next.js 16.3.1; routes include `/vault/` and `/my-materials/`.
- Static responsive check: PASS, 8 routes x 4 widths with zero failures.
- Graphify/Obsidian validation: PASS, 324 mapped nodes, 448 valid edges, 349 notes.
- Release-scope privacy scan: PASS; no institutional member-email strings, tokens, signed URLs, private bytes, or local paths in tracked release output.
- Source headshot: present; emitted derivative: 400x400 WebP, 10,264 bytes, metadata stripped.
- Remote migration/schema/count audit: PASS; seven members, eight aliases, eight Auth users, zero materials; no private values recorded.
- Remote bucket privacy: PASS, `materials.public = false`.
- Remote Auth core configuration: signup disabled, six-digit OTP length, 600-second expiry.

## Blocking gate

The authenticated Supabase Management API rejected the required Auth email-template update with the hosted free-tier default email provider. The project needs custom SMTP or an eligible email provider before the Magic Link template can be changed to include `{{ .Token }}`. Current live configuration therefore cannot yet prove real six-digit OTP delivery. No Edge Function deployment, source push, GitHub Pages publication, production browser fixture, or final release claim was made after this blocker was confirmed.

Required operator action: configure Supabase Auth email delivery and set the Magic Link template to use `{{ .Token }}`; then send one real OTP to the established operator mailbox, enter it in the browser, and rerun the authenticated Vault/Library/manage/cleanup gates.

## Remaining gates

1. OTP template/custom SMTP and real delivery.
2. Deploy and verify `materials-upload`, `material-download`, and `materials-manage` from the clean tested source.
3. Run fresh anonymous/member/admin browser checks, including no Vault metadata or signed URL before authorization and complete temporary fixture cleanup.
4. Deploy and verify `materials-upload`, `material-download`, and `materials-manage` from the clean tested source.
5. Run fresh anonymous/member/admin browser checks, including no Vault metadata or signed URL before authorization and complete temporary fixture cleanup.
6. Commit/push `main`, publish exact `out/` plus `.nojekyll` to `gh-pages`, verify Pages, then update the private backup.
