import { bearerToken, json, requestOrigin, corsHeaders } from "./http.js";
import { parseBibTeX } from "./bibtex.js";
import { resolveActiveMember } from "./authorization.js";
import { safeFilename, validateMaterialFile } from "./material.js";

const ERROR = { auth: "Authentication required.", origin: "Origin not allowed.", unavailable: "Upload service is temporarily unavailable." };

async function removeObject(client, path) {
  try { await client.storage.from("materials").remove([path]); } catch { /* best effort compensation */ }
}

export function createMaterialsUploadHandler({ createUserClient, createAdminClient, uuid = () => crypto.randomUUID() }) {
  return async request => {
    const origin = requestOrigin(request, true);
    if (origin === false) return json({ error: ERROR.origin }, 403);
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: corsHeaders(origin) });
    if (request.method !== "POST") return json({ error: "Method not allowed." }, 405, origin, { Allow: "POST, OPTIONS" });
    const token = bearerToken(request);
    if (!token) return json({ error: ERROR.auth }, 401, origin);
    let userClient, admin;
    try { userClient = createUserClient(token); admin = createAdminClient(); } catch { return json({ error: ERROR.unavailable }, 503, origin); }
    const userResult = await userClient.auth.getUser(token);
    const email = userResult.data?.user?.email?.trim().toLowerCase();
    if (userResult.error || !email) return json({ error: ERROR.auth }, 401, origin);
    let member;
    try { member = await resolveActiveMember(admin, email); } catch { return json({ error: ERROR.unavailable }, 503, origin); }
    if (!member) return json({ error: "Upload access was denied." }, 403, origin);
    let form;
    try { form = await request.formData(); } catch { return json({ error: "Invalid upload form." }, 400, origin); }
    const file = form.get("file");
    const title = String(form.get("title") || "").trim();
    const description = String(form.get("description") || "").trim();
    const bibtex = String(form.get("bibtex") || "").trim();
    const visibility = String(form.get("visibility") || "vault").toLowerCase();
    const publicAcknowledged = form.get("public_acknowledged") === "true" || form.get("public_acknowledged") === "on";
    if (!file || !title) return json({ error: "Title and file are required." }, 400, origin);
    if (title.length > 180 || description.length > 2000) return json({ error: "Title or description is too long." }, 400, origin);
    if (!["library", "vault"].includes(visibility)) return json({ error: "Invalid material destination." }, 400, origin);
    if (visibility === "library" && !publicAcknowledged) return json({ error: "Public Library acknowledgement is required." }, 400, origin);
    const fileError = await validateMaterialFile(file);
    if (fileError) return json({ error: fileError }, 400, origin);
    let citation = null;
    if (bibtex) { try { citation = parseBibTeX(bibtex); } catch (error) { return json({ error: error.message }, 400, origin); } }
    const path = `${member.id}/${uuid()}-${safeFilename(file.name)}`;
    const { error: uploadError } = await admin.storage.from("materials").upload(path, file, { contentType: file.type, upsert: false });
    if (uploadError) { await removeObject(admin, path); return json({ error: "Upload failed." }, 500, origin); }
    const { data: material, error: insertError } = await admin.from("materials").insert({ member_id: member.id, title, description, bibtex: bibtex || null, citation_json: citation, storage_path: path, file_name: file.name, mime_type: file.type, size_bytes: file.size, status: "published", visibility }).select("id").single();
    if (insertError || !material?.id) { await removeObject(admin, path); return json({ error: "Metadata could not be saved." }, 500, origin); }
    return json({ ok: true, id: material.id }, 201, origin);
  };
}
