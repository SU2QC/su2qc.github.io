import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import { createClient } from "@supabase/supabase-js";

const live = process.env.SU2QC_LIVE_RLS_TEST === "1";

test("browser-role clients resolve one member and cross-read Vault metadata", { skip: !live }, async () => {
  const env = Object.fromEntries((await readFile(new URL("../.env.local", import.meta.url), "utf8")).split(/\r?\n/).filter(line => line && !line.startsWith("#") && line.includes("=")).map(line => { const i = line.indexOf("="); return [line.slice(0, i), line.slice(i + 1).replace(/^\"|\"$/g, "")]; }));
  const secret = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  assert.ok(secret && env.NEXT_PUBLIC_SUPABASE_URL && env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);
  const admin = createClient(env.NEXT_PUBLIC_SUPABASE_URL, secret, { auth: { autoRefreshToken: false, persistSession: false } });
  const marker = `SU2QC-V211-${randomUUID()}`;
  const password = `T-${randomUUID()}-xY9!`;
  const users = [], members = [], materialIds = [], clients = [];
  try {
    for (const suffix of ["a", "b", "u"]) {
      const email = `${marker.toLowerCase()}-${suffix}@example.invalid`;
      const created = await admin.auth.admin.createUser({ email, password, email_confirm: true });
      assert.ifError(created.error);
      users.push(created.data.user);
      if (suffix === "u") continue;
      const member = await admin.from("members").insert({ email, display_name: `Test ${suffix.toUpperCase()}`, role: "member", active: true }).select("id").single();
      assert.ifError(member.error);
      members.push({ email, id: member.data.id });
      assert.ifError((await admin.from("member_emails").insert({ member_id: member.data.id, email, active: true })).error);
      const material = await admin.from("materials").insert({ member_id: member.data.id, title: `${marker}-${suffix}`, description: "temporary browser-role fixture", storage_path: `${member.data.id}/${marker}-${suffix}.txt`, file_name: `${marker}-${suffix}.txt`, mime_type: "text/plain", size_bytes: 1, status: "published", visibility: "vault" }).select("id").single();
      assert.ifError(material.error);
      materialIds.push(material.data.id);
    }
    for (const member of members) {
      const client = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, { auth: { autoRefreshToken: false, persistSession: false } });
      assert.ifError((await client.auth.signInWithPassword({ email: member.email, password })).error);
      clients.push(client);
      const own = await client.from("members").select("id,active").maybeSingle();
      assert.ifError(own.error);
      assert.equal(own.data.id, member.id);
      const vault = await client.from("materials_member").select("id").ilike("title", `${marker}%`);
      assert.ifError(vault.error);
      assert.equal(vault.data.length, 2);
    }
    const anonymous = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, { auth: { autoRefreshToken: false, persistSession: false } });
    const anonymousVault = await anonymous.from("materials_member").select("id").ilike("title", `${marker}%`);
    assert.ok(anonymousVault.error || anonymousVault.data.length === 0);
    const unapproved = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, { auth: { autoRefreshToken: false, persistSession: false } });
    assert.ifError((await unapproved.auth.signInWithPassword({ email: `${marker.toLowerCase()}-u@example.invalid`, password })).error);
    assert.equal((await unapproved.from("members").select("id").maybeSingle()).data, null);
    assert.equal((await unapproved.from("materials_member").select("id").ilike("title", `${marker}%`)).data.length, 0);
    const headers = { apikey: env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, Authorization: `Bearer ${(await clients[1].auth.getSession()).data.session.access_token}`, Origin: env.NEXT_PUBLIC_SITE_URL };
    assert.equal((await fetch(`${env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/materials-manage?id=${materialIds[0]}`, { method: "DELETE", headers })).status, 403);
    assert.ifError((await admin.from("members").update({ active: false }).eq("id", members[0].id)).error);
    assert.equal((await clients[0].from("members").select("id").maybeSingle()).data, null);
    assert.equal((await clients[0].from("materials_member").select("id").ilike("title", `${marker}%`)).data.length, 0);
    for (const client of [...clients, unapproved]) await client.auth.signOut();
  } finally {
    if (materialIds.length) await admin.from("materials").delete().in("id", materialIds);
    for (const member of members) { await admin.from("member_emails").delete().eq("member_id", member.id); await admin.from("members").delete().eq("id", member.id); }
    for (const user of users.filter(Boolean)) await admin.auth.admin.deleteUser(user.id);
  }
});
