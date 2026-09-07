import { bearerToken, json, requestOrigin, corsHeaders } from "./http.js";
import { resolveActiveMember } from "./authorization.js";
import { isUuid } from "./material.js";

export function createMaterialDownloadHandler({ createUserClient, createAdminClient }) {
  return async request => {
    const origin = requestOrigin(request);
    if (origin === false) return json({ error: "Origin not allowed." }, 403);
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: corsHeaders(origin) });
    if (request.method !== "GET") return json({ error: "Method not allowed." }, 405, origin, { Allow: "GET, OPTIONS" });
    const id = new URL(request.url).searchParams.get("id");
    if (!isUuid(id)) return json({ error: "Invalid material identifier." }, 400, origin);
    let admin;
    try { admin = createAdminClient(); } catch { return json({ error: "Download service is temporarily unavailable." }, 503, origin); }
    const { data: material, error } = await admin.from("materials").select("storage_path,status,visibility,file_name,mime_type,member_id").eq("id", id).eq("status", "published").maybeSingle();
    if (error) return json({ error: "Download service is temporarily unavailable." }, 503, origin);
    if (!material) return json({ error: "Material not found." }, 404, origin);
    if (material.visibility === "vault") {
      const token = bearerToken(request);
      if (!token || !createUserClient) return json({ error: "Authentication required." }, 401, origin);
      let userClient;
      try { userClient = createUserClient(token); } catch { return json({ error: "Authentication required." }, 401, origin); }
      const userResult = await userClient.auth.getUser(token);
      const email = userResult.data?.user?.email?.trim().toLowerCase();
      if (userResult.error || !email) return json({ error: "Authentication required." }, 401, origin);
      try { if (!await resolveActiveMember(admin, email)) return json({ error: "Download access was denied." }, 403, origin); } catch { return json({ error: "Download service is temporarily unavailable." }, 503, origin); }
    }
    const { data, error: signedError } = await admin.storage.from("materials").createSignedUrl(material.storage_path, 60, { download: material.file_name });
    if (signedError || !data?.signedUrl) return json({ error: "Download unavailable." }, 500, origin);
    return new Response(null, { status: 302, headers: { Location: data.signedUrl, "Cache-Control": "no-store, private", "X-Content-Type-Options": "nosniff", ...corsHeaders(origin) } });
  };
}
