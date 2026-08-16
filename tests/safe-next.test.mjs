import test from "node:test";
import assert from "node:assert/strict";
import { safeNext } from "../lib/safe-next.mjs";

test("safeNext keeps local paths and rejects external redirects", () => {
  assert.equal(safeNext("/upload"), "/upload");
  assert.equal(safeNext("https://example.com"), "/upload/");
  assert.equal(safeNext("//example.com"), "/upload/");
  assert.equal(safeNext("/admin"), "/upload/");
});
