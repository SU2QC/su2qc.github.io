import { bearerToken, json, requestOrigin, corsHeaders } from "./http.js";
import { parseBibTeX } from "./bibtex.js";
import { safeFilename, validateMaterialFile } from "./material.js";

const ERROR = {
  auth: "Authentication required.",
  origin: "Origin not allowed.",
  unavailable: "Upload service is temporarily unavailable.",
};

async function findActiveMember(client, email) {
  return client.from("members").select("id,active").eq("email", email).eq("active", true).maybeSingle();
}

async function removeObject(client, path) {
  try { await client.storage.from("materials").remove([path]); } catch { /* cleanup is intentionally best effort */ }
}

export function createMaterialsUploadHandler({ createUserClient, createAdminClient, uuid = () => crypto.randomUUID() }) {
  return async request => {
    const origin = requestOrigin(request, true);
    if (origin === false) return json({ error: ERROR.origin }, 403);
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: corsHeaders(origin) });
    if (request.method !== "POST") return json({ error: "Method not allowed." }, 405, origin, { Allow: "POST, OPTIONS" });

    const token = bearerToken(request);
    if (!token) return json({ error: ERROR.auth }, 401, origin);
    let userClient;
    try { userClient = createUserClient(token); } catch { return json({ error: ERROR.unavailable }, 503, origin); }
    const userResult = await userClient.auth.getUser(token);
    const user = userResult.data?.user;
    const userError = userResult.error;
    const email = user?.email?.trim().toLowerCase();
    if (userError || !email) return json({ error: ERROR.auth }, 401, origin);

    const { data: member, error: memberError } = await findActiveMember(userClient, email);
    if (memberError) return json({ error: ERROR.unavailable }, 503, origin);
    if (!member?.active) return json({ error: "This email is not approved for uploads." }, 403, origin);

    let form;
    try { form = await request.formData(); } catch { return json({ error: "Invalid upload form." }, 400, origin); }
    const file = form.get("file");
    const title = String(form.get("title") || "").trim();
    const description = String(form.get("description") || "").trim();
    const bibtex = String(form.get("bibtex") || "").trim();
    if (!file || !title) return json({ error: "Title and file are required." }, 400, origin);
    if (title.length > 180 || description.length > 2000) return json({ error: "Title or description is too long." }, 400, origin);
    const fileError = await validateMaterialFile(file);
    if (fileError) return json({ error: fileError }, 400, origin);
    let citation = null;
    if (bibtex) {
      try { citation = parseBibTeX(bibtex); } catch (error) { return json({ error: error.message }, 400, origin); }
    }

    let admin;
    try { admin = createAdminClient(); } catch { return json({ error: ERROR.unavailable }, 503, origin); }
    const { data: verifiedMember, error: verificationError } = await findActiveMember(admin, email);
    if (verificationError) return json({ error: ERROR.unavailable }, 503, origin);
    if (!verifiedMember?.active || verifiedMember.id !== member.id) return json({ error: "This email is not approved for uploads." }, 403, origin);

    const path = `${member.id}/${uuid()}-${safeFilename(file.name)}`;
    const { error: uploadError } = await admin.storage.from("materials").upload(path, file, { contentType: file.type, upsert: false });
    if (uploadError) {
      await removeObject(admin, path);
      return json({ error: "Upload failed." }, 500, origin);
    }

    const { data: secondCheck, error: secondCheckError } = await findActiveMember(admin, email);
    if (secondCheckError || !secondCheck?.active || secondCheck.id !== member.id) {
      await removeObject(admin, path);
      return json({ error: "This email is not approved for uploads." }, 403, origin);
    }
    const { data: material, error: insertError } = await admin.from("materials").insert({
      member_id: member.id,
      title,
      description,
      bibtex: bibtex || null,
      citation_json: citation,
      storage_path: path,
      file_name: file.name,
      mime_type: file.type,
      size_bytes: file.size,
      status: "published",
    }).select("id").single();
    if (insertError || !material?.id) {
      await removeObject(admin, path);
      return json({ error: "Metadata could not be saved." }, 500, origin);
    }
    return json({ ok: true, id: material.id }, 201, origin);
  };
}