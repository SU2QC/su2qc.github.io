import { json, requestOrigin, corsHeaders } from "./http.js";
import { isUuid } from "./material.js";

export function createMaterialDownloadHandler({ createPublicClient, createAdminClient }) {
  return async request => {
    const origin = requestOrigin(request);
    if (origin === false) return json({ error: "Origin not allowed." }, 403);
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: corsHeaders(origin) });
    if (request.method !== "GET") return json({ error: "Method not allowed." }, 405, origin, { Allow: "GET, OPTIONS" });
    const id = new URL(request.url).searchParams.get("id");
    if (!isUuid(id)) return json({ error: "Invalid material identifier." }, 400, origin);

    let publicClient;
    try { publicClient = createPublicClient(); } catch { return json({ error: "Download service is temporarily unavailable." }, 503, origin); }
    const { data: material, error: lookupError } = await publicClient.from("materials").select("storage_path,status").eq("id", id).eq("status", "published").maybeSingle();
    if (lookupError) return json({ error: "Download service is temporarily unavailable." }, 503, origin);
    if (!material) return json({ error: "Material not found." }, 404, origin);

    let admin;
    try { admin = createAdminClient(); } catch { return json({ error: "Download service is temporarily unavailable." }, 503, origin); }
    const { data: verified, error: verifyError } = await admin.from("materials").select("storage_path,status").eq("id", id).eq("status", "published").maybeSingle();
    if (verifyError || !verified?.storage_path || verified.storage_path !== material.storage_path) return json({ error: "Download unavailable." }, 404, origin);
    const { data, error: signedError } = await admin.storage.from("materials").createSignedUrl(verified.storage_path, 60);
    if (signedError || !data?.signedUrl) return json({ error: "Download unavailable." }, 500, origin);
    return Response.redirect(data.signedUrl, 302);
  };
}
