# Upload guide

The upload route is for active members represented by `public.members` and the normalized `public.member_emails` alias table. Keep the storage bucket private; downloads are issued as short-lived signed URLs.

Authentication and upload authorization are separate: a valid Supabase email OTP signs a user in, but only an active approved alias can see or use member routes.

## Local preview

```bash
mkdir -p .tmp .cache/npm
export TMPDIR="$PWD/.tmp"
export npm_config_cache="$PWD/.cache/npm"
npm ci --cache "$PWD/.cache/npm"
npm run build
python3 -m http.server 4173 --directory out
```

The application reads these public runtime variables:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<publishable-key>
NEXT_PUBLIC_SITE_URL=http://127.0.0.1:4173
```

The static build freezes these public variables into the browser bundle. Rebuild after changing `.env.local`.

Open `http://127.0.0.1:4173/login/`, enter an approved member email, request the six-digit code, and paste it into the second step. The email template must contain `{{ .Token }}`. If the account authenticates but has no active member record, the application shows a neutral approval message and no member data.

Then:

1. Open `/upload`.
2. Choose `Vault — members only` (the default) or `Library — public`; Library requires an explicit acknowledgement.
3. Choose a supported PDF, PPT, PPTX, Keynote, Word/OpenDocument, UTF-8 Markdown/plain text/LaTeX, source file, Jupyter notebook, or ZIP code package within the displayed 50 MB limit.
4. Enter a title and plain-language description.
5. Optionally paste one BibTeX entry into the BibTeX field.
6. Submit and wait for the success status.
7. Verify public items in `/library`; member items appear in `/vault/` after authorization.

Use `/my-materials/` to edit metadata, replace a file, move between Vault and Library, archive/restore, or delete. Ownership is derived server-side from the authenticated alias; client-supplied owner IDs are ignored. Library files and metadata are public, Vault files and metadata are member-only, and no uploaded active content is executed or inline-rendered. Malware scanning is not included.

If Supabase is not configured, the local preview shows configuration guidance. If Supabase/Auth is unreachable, it shows a separate temporary-service message; raw backend errors are not exposed.

## Member administration

An administrator can add or remove approval through the Supabase dashboard Table Editor for `public.members`. Store emails lowercase, set `active` to `true` only for approved members, and deactivate rather than delete when retaining audit history matters. Do not put the service-role key in the browser or ask a member to use it.

Safe idempotent allowlist operations are:

```sql
insert into public.members (email, display_name, role, active)
values (lower('<approved-email>'), '<display name>', 'member', true)
on conflict (email) do update
set display_name = excluded.display_name,
    active = true;

update public.members
set active = false
where email = lower('<email-to-revoke>');
```

Manage aliases server-side through the authenticated Supabase workflow. Ensure each approved alias has an Auth identity without sending invitations to the full list. Never place an admin key, OTP, session token, or signed URL in `.env.local`, source, shell history, screenshots, or chat.

## Supported checks

The `materials-upload` and `materials-manage` Edge Functions validate the extension, MIME type, size, text encoding/notebook JSON/container signature, metadata, destination acknowledgement, ownership, and cleanup before storage. BibTeX is parsed in the functions and rendered as a conventional citation; malformed input is rejected. Signature checks are not malware scanning, so administrators should use their normal document-security process for uploaded files.

## Troubleshooting

- `Configuration required`: check the URL and publishable key names, then restart Next.js.
- `Authentication unavailable` or temporary service messages: verify the project URL, public key family, DNS/TLS access, and Auth status without exposing keys.
- `401`: the browser has no valid session; sign in again.
- `403` or `Member approval required`: the Auth user exists but has no active matching member alias.
- `42P01` or schema errors: apply the reviewed migrations in order and verify RLS/policies.
- Upload type/size/signature errors: use a genuine supported file within 50 MiB; renamed containers, binary text, invalid notebooks, and mismatched MIME/extensions are rejected.
- Metadata/cleanup failures: verify the member-folder storage policies and inspect only the named test artifact.
