import test from "node:test";
import assert from "node:assert/strict";
import { createMaterialsUploadHandler } from "../supabase/functions/_shared/upload-handler.js";
import { createMaterialDownloadHandler } from "../supabase/functions/_shared/download-handler.js";

const member = { id: "11111111-1111-4111-8111-111111111111", active: true };
const materialId = "22222222-2222-4222-8222-222222222222";
const origin = "http://127.0.0.1:4173";

function memberClient(result = { data: member, error: null }) {
  const builder = { select: () => builder, eq: () => builder, maybeSingle: async () => result };
  return { from: () => builder };
}

function memberQuery(result = { data: member, error: null }) {
  const builder = { select: () => builder, eq: () => builder, maybeSingle: async () => result };
  return builder;
}

function request(method, headers = {}, body) {
  return new Request("https://zvhachktcgnkxwtdxucj.supabase.co/functions/v1/materials-upload", { method, headers, body });
}

function uploadDeps({ memberResult, insertResult = { data: { id: materialId }, error: null }, uploadError = null } = {}) {
  const removed = [];
  const admin = {
    from(table) {
      if (table === "members") return memberQuery(memberResult);
      return { insert: () => ({ select: () => ({ single: async () => insertResult }) }) };
    },
    storage: { from: () => ({ upload: async () => ({ error: uploadError }), remove: async paths => { removed.push(...paths); return { error: null }; } }) },
  };
  return {
    removed,
    createUserClient: () => ({ auth: { getUser: async () => ({ data: { user: { email: "member@example.edu" } }, error: null }) }, ...memberClient(memberResult) }),
    createAdminClient: () => admin,
  };
}

test("upload rejects methods, origins, and missing JWTs", async () => {
  const handler = createMaterialsUploadHandler(uploadDeps());
  assert.equal((await handler(request("GET", { origin }))).status, 405);
  assert.equal((await handler(request("POST", { origin: "https://evil.example" }))).status, 403);
  assert.equal((await handler(request("POST", { origin }))).status, 401);
});

test("upload rejects non-members and invalid files", async () => {
  const denied = createMaterialsUploadHandler(uploadDeps({ memberResult: { data: null, error: null } }));
  const deniedBody = new FormData();
  deniedBody.set("title", "Denied");
  deniedBody.set("file", new File(["bad"], "bad.pdf", { type: "application/pdf" }));
  assert.equal((await denied(request("POST", { origin, authorization: "Bearer user" }, deniedBody))).status, 403);

  const handler = createMaterialsUploadHandler(uploadDeps());
  const invalid = new FormData();
  invalid.set("title", "Invalid");
  invalid.set("file", new File(["bad"], "bad.pdf", { type: "application/pdf" }));
  assert.equal((await handler(request("POST", { origin, authorization: "Bearer user" }, invalid))).status, 400);
});

test("upload removes the object when metadata insertion fails", async () => {
  const deps = uploadDeps({ insertResult: { data: null, error: new Error("insert failed") } });
  const handler = createMaterialsUploadHandler({ ...deps, uuid: () => "33333333-3333-4333-8333-333333333333" });
  const form = new FormData();
  form.set("title", "Test");
  form.set("description", "A test");
  form.set("bibtex", "@article{key, author={Doe, Jane}, title={A test}}");
  form.set("file", new File(["%PDF-1.7"], "test.pdf", { type: "application/pdf" }));
  assert.equal((await handler(request("POST", { origin, authorization: "Bearer user" }, form))).status, 500);
  assert.equal(deps.removed.length, 1);
  assert.match(deps.removed[0], new RegExp(`^${member.id}/33333333-3333-4333-8333-333333333333-`));
});

test("download rejects malformed IDs and returns a short-lived signed redirect", async () => {
  const handler = createMaterialDownloadHandler({
    createPublicClient: () => ({ from: () => ({ select: () => ({ eq: () => ({ eq: () => ({ maybeSingle: async () => ({ data: { storage_path: "member/file.pdf", status: "published" }, error: null }) }) }) }) }) }),
    createAdminClient: () => ({ from: () => ({ select: () => ({ eq: () => ({ eq: () => ({ maybeSingle: async () => ({ data: { storage_path: "member/file.pdf", status: "published" }, error: null }) }) }) }) }), storage: { from: () => ({ createSignedUrl: async (_path, seconds) => ({ data: { signedUrl: `https://private.example/${seconds}` }, error: null }) }) } }),
  });
  const bad = await handler(new Request(`https://example.test?id=bad`));
  assert.equal(bad.status, 400);
  const good = await handler(new Request(`https://example.test?id=${materialId}`));
  assert.equal(good.status, 302);
  assert.equal(good.headers.get("location"), "https://private.example/60");
});
