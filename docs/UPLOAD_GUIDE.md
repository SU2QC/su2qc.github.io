# Upload guide

The upload route is for active members listed in the Supabase `members` table. Keep the storage bucket private; downloads are issued as short-lived signed URLs.

Authentication and upload authorization are separate: a valid password signs a user in, but only an active lowercase email in `public.members` can see or use the upload form.

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

Open `http://127.0.0.1:4173/login/`, enter the approved member email and password, and submit. If the account authenticates but has no active `public.members` row, the application shows an approval message and no upload form.

Then:

1. Open `/upload`.
2. Choose a supported PDF, PPT, PPTX, or genuine Keynote file within the displayed 50 MB limit.
3. Enter a title and plain-language description.
4. Optionally paste one BibTeX entry into the BibTeX field.
5. Submit and wait for the success status.
6. Verify the material and formatted citation in `/library` and test its download link.

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

Manage the allowlist in the Supabase dashboard Table Editor for `public.members`. Manage Auth passwords only through Supabase Auth administration. Never place a password or admin key in `.env.local`, source, shell history, screenshots, or chat.

## Supported checks

The `materials-upload` Edge Function validates the extension, MIME type, size, description/title limits, and file signature before storage. BibTeX is parsed in the function and rendered as a conventional citation; malformed input is rejected. Signature checks are not malware scanning, so administrators should use their normal document-security process for uploaded files.

## Troubleshooting

- `Configuration required`: check the URL and publishable key names, then restart Next.js.
- `Authentication unavailable` or temporary service messages: verify the project URL, public key family, DNS/TLS access, and Auth status without exposing keys.
- `401`: the browser has no valid session; sign in again.
- `403` or `Member approval required`: the Auth user exists but has no active matching `public.members` row.
- `42P01` or schema errors: apply the reviewed migrations in order and verify RLS/policies.
- Upload type/size/signature errors: use a genuine supported file within 50 MiB; renamed ZIP files are rejected.
- Metadata/cleanup failures: verify the member-folder storage policies and inspect only the named test artifact.
