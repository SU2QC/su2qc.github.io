import { bearerToken, json, requestOrigin, corsHeaders } from "./http.js";
import { parseBibTeX } from "./bibtex.js";
import { canManage, resolveActiveMember } from "./authorization.js";
import { isUuid, safeFilename, validateMaterialFile } from "./material.js";

const SAFE_FIELDS = "id,member_id,title,description,bibtex,citation_json,file_name,mime_type,status,visibility,created_at,updated_at,members(display_name)";

async function removeObject(client, path) {
  try { return await client.storage.from("materials").remove([path]); } catch { return { error: true }; }
}

function safeMaterial(row) {
  if (!row) return row;
  const { member_id: ignored, members, ...safe } = row;
  return { ...safe, display_name: members?.display_name || null };
}

async function getMaterial(admin, id) {
  return admin.from("materials").select("id,member_id,title,description,bibtex,citation_json,storage_path,file_name,mime_type,size_bytes,status,visibility,created_at,updated_at").eq("id", id).maybeSingle();
}

function parseMetadata(form, current) {
  const title = String(form.title ?? current.title).trim();
  const description = String(form.description ?? current.description ?? "").trim();
  const bibtex = String(form.bibtex ?? current.bibtex ?? "").trim();
  const visibility = String(form.visibility ?? current.visibility).toLowerCase();
  const status = String(form.status ?? current.status).toLowerCase();
  if (!title || title.length > 180 || description.length > 2000) throw new Error("Invalid material metadata.");
  if (!["library", "vault"].includes(visibility) || !["published", "archived", "draft"].includes(status)) throw new Error("Invalid material metadata.");
  if (visibility === "library" && form.public_acknowledged !== true && form.public_acknowledged !== "true") throw new Error("Public Library acknowledgement is required.");
  let citation = null;
  if (bibtex) citation = parseBibTeX(bibtex);
  return { title, description, bibtex: bibtex || null, citation_json: citation, visibility, status };
}

async function auth(request, createUserClient, createAdminClient) {
  const token = bearerToken(request);
  if (!token) return { error: json({ error: "Authentication required." }, 401) };
  let userClient, admin;
  try { userClient = createUserClient(token); admin = createAdminClient(); } catch { return { error: json({ error: "Management service is temporarily unavailable." }, 503) }; }
  const userResult = await userClient.auth.getUser(token);
  const email = userResult.data?.user?.email?.trim().toLowerCase();
  if (userResult.error || !email) return { error: json({ error: "Authentication required." }, 401) };
  try {
    const member = await resolveActiveMember(admin, email);
    return member ? { admin, member } : { error: json({ error: "Management access was denied." }, 403) };
  } catch { return { error: json({ error: "Management service is temporarily unavailable." }, 503) }; }
}

export function createMaterialsManageHandler({ createUserClient, createAdminClient, uuid = () => crypto.randomUUID() }) {
  return async request => {
    const origin = requestOrigin(request, true);
    if (origin === false) return json({ error: "Origin not allowed." }, 403);
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: corsHeaders(origin) });
    if (!["GET", "PATCH", "PUT", "DELETE"].includes(request.method)) return json({ error: "Method not allowed." }, 405, origin);
    const result = await auth(request, createUserClient, createAdminClient);
    if (result.error) return new Response(result.error.body, { status: result.error.status, headers: { ...Object.fromEntries(result.error.headers), ...corsHeaders(origin) } });
    const { admin, member } = result;
    if (request.method === "GET") {
      let query = admin.from("materials").select(SAFE_FIELDS).order("updated_at", { ascending: false });
      if (member.role !== "admin") query = query.eq("member_id", member.id);
      const { data, error } = await query;
      if (error) return json({ error: "Management service is temporarily unavailable." }, 503, origin);
      return json({ materials: (data || []).map(safeMaterial) }, 200, origin, { "Cache-Control": "no-store, private" });
    }
    const id = new URL(request.url).searchParams.get("id");
    if (!isUuid(id)) return json({ error: "Invalid material identifier." }, 400, origin);
    const { data: current, error: lookupError } = await getMaterial(admin, id);
    if (lookupError) return json({ error: "Management service is temporarily unavailable." }, 503, origin);
    if (!current) return json({ error: "Material not found." }, 404, origin);
    if (!canManage(member, current.member_id)) return json({ error: "Management access was denied." }, 403, origin);
    if (request.method === "DELETE") {
      const { error: deleteError } = await admin.from("materials").delete().eq("id", id);
      if (deleteError) return json({ error: "Material could not be deleted." }, 500, origin);
      const removed = await removeObject(admin, current.storage_path);
      if (removed?.error) return json({ error: "Material metadata was deleted, but file cleanup needs administrator attention." }, 500, origin);
      return json({ ok: true }, 200, origin);
    }
    if (request.method === "PATCH") {
      let body;
      try { body = await request.json(); } catch { return json({ error: "Invalid management request." }, 400, origin); }
      let metadata;
      try { metadata = parseMetadata(body, current); } catch (error) { return json({ error: error.message }, 400, origin); }
      const { error } = await admin.from("materials").update(metadata).eq("id", id);
      return error ? json({ error: "Material could not be updated." }, 500, origin) : json({ ok: true }, 200, origin);
    }
    let form;
    try { form = await request.formData(); } catch { return json({ error: "Invalid replacement request." }, 400, origin); }
    const file = form.get("file");
    if (!file) return json({ error: "A replacement file is required." }, 400, origin);
    const fileError = await validateMaterialFile(file);
    if (fileError) return json({ error: fileError }, 400, origin);
    let metadata;
    try { metadata = parseMetadata(Object.fromEntries(form.entries()), current); } catch (error) { return json({ error: error.message }, 400, origin); }
    const path = `${current.member_id}/${uuid()}-${safeFilename(file.name)}`;
    const { error: uploadError } = await admin.storage.from("materials").upload(path, file, { contentType: file.type, upsert: false });
    if (uploadError) { await removeObject(admin, path); return json({ error: "Replacement upload failed." }, 500, origin); }
    const { error: updateError } = await admin.from("materials").update({ ...metadata, storage_path: path, file_name: file.name, mime_type: file.type, size_bytes: file.size }).eq("id", id);
    if (updateError) { await removeObject(admin, path); return json({ error: "Material metadata could not be updated." }, 500, origin); }
    const removed = await removeObject(admin, current.storage_path);
    if (removed?.error) return json({ error: "Material was replaced, but old-file cleanup needs administrator attention." }, 500, origin);
    return json({ ok: true }, 200, origin);
  };
}
