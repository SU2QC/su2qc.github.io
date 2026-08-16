import test from "node:test";
import assert from "node:assert/strict";
import { MAX_BYTES, validateMaterialFile } from "../lib/material-validation.mjs";

const upload = (name, type, bytes, size = bytes.length) => ({ name, type, size, arrayBuffer: async () => bytes.buffer });

test("material validation checks extension, MIME, size, and signature", async () => {
  assert.equal(await validateMaterialFile(upload("paper.pdf", "application/pdf", new TextEncoder().encode("%PDF-1.7"))), null);
  assert.match(await validateMaterialFile(upload("paper.txt", "application/pdf", new TextEncoder().encode("%PDF-1.7"))), /matching/);
  assert.match(await validateMaterialFile(upload("paper.pdf", "application/pdf", new TextEncoder().encode("plain text"))), /contents/);
  assert.match(await validateMaterialFile(upload("paper.pdf", "text/plain", new TextEncoder().encode("plain text"))), /matching/);
  assert.match(await validateMaterialFile(upload("slides.ppt", "application/vnd.ms-powerpoint", new Uint8Array())), /contents/);
  assert.match(await validateMaterialFile(upload("paper.pdf", "application/pdf", new Uint8Array(), MAX_BYTES + 1)), /50 MB/);
});
