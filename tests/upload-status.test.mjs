import test from "node:test";
import assert from "node:assert/strict";
import { messageForUploadError, messageForUploadResponse } from "../lib/upload-status.mjs";
import { SupabaseConfigurationError } from "../lib/supabase/config.js";

test("upload errors keep configuration, session, network, and response failures distinct", () => {
  assert.match(messageForUploadError(new SupabaseConfigurationError(), "config"), /configuration is unavailable/);
  assert.match(messageForUploadError({ code: "refresh_token_not_found" }, "session"), /session has expired/);
  assert.match(messageForUploadError(new TypeError("Failed to fetch"), "network"), /could not be reached/);
  assert.match(messageForUploadError(null, "response"), /invalid response/);
});

test("upload responses distinguish denial, unavailability, and validation", () => {
  assert.match(messageForUploadResponse(403, { error: "This email is not approved for uploads." }), /not approved/);
  assert.match(messageForUploadResponse(503), /temporarily unavailable/);
  assert.match(messageForUploadResponse(400, { error: "Use a matching PDF" }), /matching PDF/);
  assert.match(messageForUploadResponse(201), /Published successfully/);
});
