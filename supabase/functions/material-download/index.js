import { createClient } from "https://esm.sh/@supabase/supabase-js@2.112.3";
import { createMaterialDownloadHandler } from "../_shared/download-handler.js";

const url = Deno.env.get("SUPABASE_URL");
const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

function publicClient() {
  return createClient(url, anonKey, { auth: { autoRefreshToken: false, persistSession: false } });
}

function adminClient() {
  return createClient(url, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } });
}

Deno.serve(createMaterialDownloadHandler({ createPublicClient: publicClient, createAdminClient: adminClient }));
