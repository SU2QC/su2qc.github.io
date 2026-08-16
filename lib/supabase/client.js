import { createBrowserClient } from "@supabase/ssr";
import { getPublicConfig } from "./config";

export function createClient() {
  const { url, key } = getPublicConfig();
  return createBrowserClient(url, key);
}
