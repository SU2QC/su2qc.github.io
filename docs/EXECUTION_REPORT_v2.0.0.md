# SU2QC v2.0.0 execution report

Date: 2026-09-07
Result: `PASS — v2.0.0 verified and published`

## Completed

- Added the new People entries, public profile links, safe Juan `JG` placeholder, and a 400x400 metadata-stripped supplied-portrait derivative.
- Added OTP login UI, `/vault/`, `/my-materials/`, Vault/Library destination controls, explicit public acknowledgement, and owner/admin management actions.
- Added migration `006_v2_0_0_people_vault_otp.sql` and applied it remotely as `20260907192755`.
- Added forward-only migrations `007`–`009` to preserve private alias access, resolve membership through a restricted security-definer helper, and align the Storage MIME allowlist with server validation.
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
- Real OTP delivery and browser verification: PASS for the specified operator mailbox; no OTP value was recorded.
- Authenticated browser acceptance: PASS for Vault isolation, upload, management metadata update, public Library rendering, signed download, and logout.
- Temporary fixture cleanup: PASS; zero temporary material rows and zero temporary Storage objects remain. Two pre-existing orphaned Storage objects were not modified.
- Unauthenticated denial: PASS; `/vault/` redirected to `/login/?next=/vault/`, and unauthenticated Vault metadata access was denied.
- Edge Functions: PASS deployment active for `materials-upload`, `material-download`, and `materials-manage`.

## Blocking gate

The SMTP/OTP blocker is cleared. Source, exact static export, live Pages routes, and the established private backup were verified.

## Remaining gates

1. Rerun final tests, lint, build, responsive layout, privacy, secret, Graphify, and Obsidian gates after the corrective migrations.
2. Commit/push `main`, publish the exact tested `out/` plus `.nojekyll` to `gh-pages`, and verify every live route.
3. Update and restore-check the established private backup. `PASS`.

Final publication coordinates: source `e9f7863d8b2d6a2d0ce5f879d6380cbab0e68dfb`, Pages `6ffce1670209152666ae134afa74e3c29ff88c49`. Final backup verification is recorded in the operator handoff; no test fixtures remain.
