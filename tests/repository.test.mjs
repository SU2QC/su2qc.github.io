import test from "node:test";
import assert from "node:assert/strict";
import { readFile, access } from "node:fs/promises";
import { constants } from "node:fs";

const text = path => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("all required routes exist", async () => {
  for (const route of ["app/page.js","app/research/page.js","app/people/page.js","app/library/page.js","app/login/page.js","app/upload/page.js","app/vault/page.js","app/my-materials/page.js"]) await access(new URL(`../${route}`, import.meta.url), constants.R_OK);
});

test("approved hero and investigator assets are wired to the matching people", async () => {
  for (const asset of [
    "public/images/su2qc-hero.png",
    "public/images/su2qc-logo.png",
    "public/images/investigators/raza-sabbir-sufian.png",
    "public/images/investigators/paulo-f-bedaque.jpg",
    "public/images/investigators/taku-izubuchi.jpg",
    "public/images/investigators/kwangmin-yu.jpeg",
    "public/images/people/md-habib-e-islam-digonto.webp",
  ]) await access(new URL(`../${asset}`, import.meta.url), constants.R_OK);
  const home = await text("app/page.js");
  const people = await text("data/people.js");
  assert.match(home, /su2qc-hero\.png/);
  assert.match(await text("components/site-header.js"), /su2qc-logo\.png/);
  assert.match(people, /raza-sabbir-sufian\.png/);
  assert.match(people, /paulo-f-bedaque\.jpg/);
  assert.match(people, /taku-izubuchi\.jpg/);
  assert.match(people, /kwangmin-yu\.jpeg/);
  assert.match(people, /md-habib-e-islam-digonto\.webp/);
  assert.match(people, /juan-gil-fraile/);
});

test("investigator source portraits map one-to-one to emitted assets", async () => {
  const mappings = [
    ["Kwangmin Yu.jpeg", "public/images/investigators/kwangmin-yu.jpeg", ".jpeg"],
    ["Paulo F. Bedaque.jpg", "public/images/investigators/paulo-f-bedaque.jpg", ".jpg"],
    ["Raza Sabbir Sufian.png", "public/images/investigators/raza-sabbir-sufian.png", ".png"],
    ["Taku Izubuchi.jpg", "public/images/investigators/taku-izubuchi.jpg", ".jpg"],
  ];
  const people = await text("data/people.js");
  const emitted = mappings.map(([, asset]) => asset);
  assert.equal(new Set(emitted).size, mappings.length);
  for (const [source, asset, extension] of mappings) {
    await access(new URL(`../source_image/${source}`, import.meta.url), constants.R_OK);
    await access(new URL(`../${asset}`, import.meta.url), constants.R_OK);
    assert.match(asset, new RegExp(`${extension.replace(".", "\\.")}$`));
  }
  assert.equal((people.match(/imageAlt:"[^"]+"/g) || []).length, mappings.length + 2);
  assert.equal((people.match(/image:"\/images\/investigators\/[^"]+"/g) || []).length, mappings.length);
  assert.equal(new Set(people.match(/image:"(\/images\/investigators\/[^\"]+)"/g)).size, mappings.length);
  assert.match(people, /imageAlt:"Initials placeholder for Juan Gil Fraile"/);
});

test("favicon is a checked-in ICO and is referenced by root metadata", async () => {
  const favicon = await readFile(new URL("../app/favicon.ico", import.meta.url));
  const layout = await text("app/layout.js");
  assert.deepEqual(favicon.subarray(0, 4), Buffer.from([0, 0, 1, 0]));
  assert.match(layout, /icons:\s*\{\s*icon:\s*["']\/favicon\.ico["']/s);
});

test("visual sections use the shared stacked heading-description pattern", async () => {
  const component = await text("components/section-intro.js");
  assert.match(component, /data-heading-description/);
  for (const route of ["app/page.js", "app/research/page.js", "app/people/page.js", "app/library/page.js", "app/login/page.js", "app/upload/page.js", "app/vault/page.js", "app/my-materials/page.js"]) {
    assert.match(await text(route), /SectionIntro/);
  }
});

test("accessibility primitives remain present", async () => {
  const layout = await text("app/layout.js");
  const css = await text("app/globals.css");
  const login = await text("components/login-form.js");
  const upload = await text("components/upload-form.js");
  assert.match(layout, /skip-link/);
  assert.match(css, /:focus-visible/);
  assert.match(css, /prefers-reduced-motion/);
  assert.match(css, /min-height: 44px/);
  assert.match(login, /aria-live="polite"/);
  assert.match(upload, /aria-live="polite"/);
});

test("Edge Functions enforce membership, type, size, and private cleanup", async () => {
  const source = await text("supabase/functions/_shared/upload-handler.js");
  assert.match(source, /Upload access was denied/);
  assert.match(source, /validateMaterialFile/);
  assert.match(source, /removeObject/);
  assert.match(source, /visibility/);
  assert.match(source, /Origin not allowed/);
  assert.match(source, /title\.length > 180/);
});

test("database enables row-level security and private storage", async () => {
  const sql = await text("supabase/migrations/002_live_supabase_bootstrap.sql");
  assert.match(sql, /enable row level security/);
  assert.match(sql, /'materials',\s+'materials',\s+false/);
  assert.match(sql, /approved uploads/);
  assert.match(sql, /split_part\(name, '\/', 1\)/);
  assert.match(sql, /approved member reads own objects/);
  assert.match(sql, /approved member deletes own objects/);
  assert.match(sql, /public downloads of published materials/);
  assert.match(sql, /security_invoker/);
});

test("v2 migration separates aliases, Library visibility, and member-only metadata", async () => {
  const sql = await text("supabase/migrations/006_v2_0_0_people_vault_otp.sql");
  assert.match(sql, /create table if not exists public\.member_emails/);
  assert.match(sql, /visibility text not null default 'library'/);
  assert.match(sql, /materials_visibility_check_v2/);
  assert.match(sql, /where x\.status = 'published' and x\.visibility = 'library'/);
  assert.match(sql, /create policy "active members read all materials"/);
  assert.match(sql, /revoke all on public\.member_emails from anon, authenticated/);
  assert.match(sql, /public\.materials_member/);
});

test("alias RLS permits only authenticated self-resolution", async () => {
  const sql = await text("supabase/migrations/007_v2_0_0_member_email_rls_fix.sql");
  assert.match(sql, /for select to authenticated/);
  assert.match(sql, /auth\.jwt\(\) ->> 'email'/);
  assert.match(sql, /member_email/);
});

test("membership policy checks use a restricted security-definer helper", async () => {
  const sql = await text("supabase/migrations/008_v2_0_0_member_email_security_definer.sql");
  assert.match(sql, /security definer/);
  assert.match(sql, /set row_security = off/);
  assert.match(sql, /revoke all on function/);
  assert.match(sql, /is_active_member_for_email\(member_id/);
});

test("storage MIME policy matches the v2 upload allowlist", async () => {
  const sql = await text("supabase/migrations/009_v2_0_0_material_mime_allowlist.sql");
  assert.match(sql, /text\/plain/);
  assert.match(sql, /application\/x-ipynb\+json/);
  assert.match(sql, /application\/zip/);
});

test("static export and download function preserve security boundaries", async () => {
  const download = await text("supabase/functions/_shared/download-handler.js");
  const config = await text("next.config.mjs");
  assert.match(download, /createSignedUrl/);
  assert.match(download, /isUuid/);
  assert.match(config, /output: "export"/);
  assert.match(config, /trailingSlash: true/);
  assert.match(config, /unoptimized: true/);
  await assert.rejects(access(new URL("../app/api/materials/route.js", import.meta.url)));
});

test("password login and upload access use safe local redirects and allowlists", async () => {
  const login = await text("components/login-form.js");
  const upload = await text("app/upload/page.js");
  assert.match(login, /signInWithOtp/);
  assert.match(login, /verifyOtp/);
  assert.match(login, /one-time-code/);
  assert.match(login, /safeNext/);
  assert.match(upload, /memberError/);
  assert.match(upload, /Member approval required/);
  assert.match(upload, /isMissingAuthSession/);
  assert.match(login, /safeNext/);
});

test("upload reset does not use a React event target after await", async () => {
  const upload = await text("components/upload-form.js");
  assert.match(upload, /const formElement = event\.currentTarget/);
  assert.match(upload, /formElement\.reset\(\)/);
  assert.doesNotMatch(upload, /event\.currentTarget\.reset\(\)/);
});

test("public Supabase configuration uses only the modern browser key", async () => {
  const config = await text("lib/supabase/config.js");
  const client = await text("lib/supabase/client.js");
  assert.match(config, /NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY/);
  assert.doesNotMatch(config, /NEXT_PUBLIC_SUPABASE_ANON_KEY/);
  assert.match(client, /getPublicConfig/);
});

test("Vault and management shells contain no private material at build time", async () => {
  const vault = await text("app/vault/page.js");
  const manage = await text("app/my-materials/page.js");
  assert.match(vault, /static page contains no private content/);
  assert.match(manage, /Manage materials/);
  assert.doesNotMatch(vault, /storage_path|member_emails|citation_json/);
  assert.doesNotMatch(manage, /storage_path|member_emails/);
});
