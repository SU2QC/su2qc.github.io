export const ALLOWED_ORIGINS = new Set([
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://localhost:4173",
  "http://127.0.0.1:4173",
  "https://su2qc.github.io",
]);

export function requestOrigin(request, required = false) {
  const origin = request.headers.get("origin");
  if (!origin && !required) return null;
  return origin && ALLOWED_ORIGINS.has(origin) ? origin : false;
}

export function corsHeaders(origin) {
  return origin ? {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Headers": "authorization, content-type, x-client-info, apikey",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Vary": "Origin",
  } : {};
}

export function json(data, status, origin = null, extra = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders(origin), ...extra },
  });
}

export function bearerToken(request) {
  const value = request.headers.get("authorization") || "";
  return value.match(/^Bearer\s+([^\s]+)$/i)?.[1] || null;
}
