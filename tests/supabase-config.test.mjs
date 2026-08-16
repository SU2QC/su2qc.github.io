import test from "node:test";
import assert from "node:assert/strict";
import { getPublicConfig, SupabaseConfigurationError } from "../lib/supabase/config.js";
import { isMissingAuthSession } from "../lib/supabase/auth.js";

test("stale refresh tokens are treated as missing sessions", () => {
  assert.equal(isMissingAuthSession({ code: "refresh_token_not_found" }), true);
  assert.equal(isMissingAuthSession({ message: "Invalid Refresh Token: Refresh Token Not Found" }), true);
  assert.equal(isMissingAuthSession({ code: "server_error" }), false);
});

test("public configuration prefers the modern publishable key", () => {
  const saved = {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    publishable: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  };
  try {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = "sb_publishable_test";
    assert.deepEqual(getPublicConfig(), { url: "https://example.supabase.co", key: "sb_publishable_test" });
  } finally {
    for (const [name, value] of Object.entries({
      NEXT_PUBLIC_SUPABASE_URL: saved.url,
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: saved.publishable,
    })) {
      if (value === undefined) delete process.env[name];
      else process.env[name] = value;
    }
  }
});

test("public configuration fails clearly when both public key names are absent", () => {
  const saved = {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    publishable: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  };
  try {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
    delete process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    assert.throws(getPublicConfig, SupabaseConfigurationError);
  } finally {
    for (const [name, value] of Object.entries({
      NEXT_PUBLIC_SUPABASE_URL: saved.url,
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: saved.publishable,
    })) {
      if (value === undefined) delete process.env[name];
      else process.env[name] = value;
    }
  }
});
