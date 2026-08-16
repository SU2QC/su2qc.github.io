import { createClient } from "https://esm.sh/@supabase/supabase-js@2.112.3";
import { createMaterialsUploadHandler } from "../_shared/upload-handler.js";

const url = Deno.env.get("SUPABASE_URL");
const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

function userClient(token) {
  return createClient(url, anonKey, { auth: { autoRefreshToken: false, persistSession: false }, global: { headers: { Authorization: `Bearer ${token}` } } });
}

function adminClient() {
  return createClient(url, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } });
}

Deno.serve(createMaterialsUploadHandler({ createUserClient: userClient, createAdminClient: adminClient }));
