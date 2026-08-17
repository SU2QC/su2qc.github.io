import { isMissingAuthSession } from "./supabase/auth.js";
import { SupabaseConfigurationError } from "./supabase/config.js";

export function messageForUploadError(error, stage) {
  if (stage === "config" || error instanceof SupabaseConfigurationError) return "Upload configuration is unavailable. Try again later.";
  if (stage === "session" && isMissingAuthSession(error)) return "Your session has expired. Sign in again.";
  if (stage === "session") return "Authentication is unavailable. Sign in again and retry.";
  if (stage === "network") return "The upload service could not be reached. Check your connection and try again.";
  if (stage === "response") return "The upload service returned an invalid response. Try again shortly.";
  return "The upload could not be completed. Try again.";
}

export function messageForUploadResponse(status, data = {}) {
  if (status >= 200 && status < 300) return "Published successfully. Open the library to verify it.";
  if (status === 401) return "Your session has expired. Sign in again.";
  if (status === 403) return data.error === "This email is not approved for uploads." ? data.error : "Upload access was denied.";
  if ([502, 503, 504].includes(status)) return "The upload service is temporarily unavailable. Try again shortly.";
  return typeof data.error === "string" && data.error ? data.error : "The upload could not be completed. Check the file and try again.";
}
