export class SupabaseConfigurationError extends Error {
  constructor(message = "Supabase public configuration is missing.") {
    super(message);
    this.name = "SupabaseConfigurationError";
  }
}

export function getPublicConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) throw new SupabaseConfigurationError();
  return { url: url.replace(/\/+$/, ""), key };
}
