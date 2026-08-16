import test from "node:test";
import assert from "node:assert/strict";
import { readFile, access } from "node:fs/promises";
import { constants } from "node:fs";

const text = path => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("all required routes exist", async () => {
  for (const route of ["app/page.js","app/research/page.js","app/people/page.js","app/library/page.js","app/login/page.js","app/upload/page.js"]) await access(new URL(`../${route}`, import.meta.url), constants.R_OK);
});

test("approved hero and investigator assets are wired to the matching people", async () => {
  for (const asset of [
    "public/images/su2qc-hero.png",
    "public/images/su2qc-logo.png",
    "public/images/investigators/raza-sabbir-sufian.png",
    "public/images/investigators/paulo-f-bedaque.jpg",
    "public/images/investigators/taku-izubuchi.jpg",
    "public/images/investigators/kwangmin-yu.jpeg",
  ]) await access(new URL(`../${asset}`, import.meta.url), constants.R_OK);
  const home = await text("app/page.js");
  const people = await text("data/people.js");
  assert.match(home, /su2qc-hero\.png/);
  assert.match(await text("components/site-header.js"), /su2qc-logo\.png/);
  assert.match(people, /raza-sabbir-sufian\.png/);
  assert.match(people, /paulo-f-bedaque\.jpg/);
  assert.match(people, /taku-izubuchi\.jpg/);
  assert.match(people, /kwangmin-yu\.jpeg/);
});

test("visual sections use the shared stacked heading-description pattern", async () => {
  const component = await text("components/section-intro.js");
  assert.match(component, /data-heading-description/);
  for (const route of ["app/page.js", "app/research/page.js", "app/people/page.js", "app/library/page.js", "app/login/page.js", "app/upload/page.js"]) {
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
  assert.match(source, /This email is not approved for uploads/);
  assert.match(source, /validateMaterialFile/);
  assert.match(source, /removeObject/);
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
  assert.match(login, /signInWithPassword/);
  assert.match(login, /current-password/);
  assert.match(login, /safeNext/);
  assert.match(upload, /memberError/);
  assert.match(upload, /Member approval required/);
  assert.match(upload, /isMissingAuthSession/);
  assert.match(login, /safeNext/);
});

test("public Supabase configuration uses only the modern browser key", async () => {
  const config = await text("lib/supabase/config.js");
  const client = await text("lib/supabase/client.js");
  assert.match(config, /NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY/);
  assert.doesNotMatch(config, /NEXT_PUBLIC_SUPABASE_ANON_KEY/);
  assert.match(client, /getPublicConfig/);
});
