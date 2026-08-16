export const MAX_BYTES = 50 * 1024 * 1024;
export const ALLOWED_TYPES = new Set([
  "application/pdf",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/vnd.apple.keynote",
]);
const EXTENSIONS = new Set([".pdf", ".ppt", ".pptx", ".key"]);
const PPT_SIGNATURE = [0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1];

function hasSignature(bytes, type) {
  if (type === "application/pdf") return new TextDecoder().decode(bytes.slice(0, 5)) === "%PDF-";
  if (type === "application/vnd.ms-powerpoint") return bytes.length >= 8 && PPT_SIGNATURE.every((value, index) => bytes[index] === value);
  return bytes.length >= 2 && bytes[0] === 0x50 && bytes[1] === 0x4b;
}

export async function validateMaterialFile(file) {
  const name = typeof file?.name === "string" ? file.name : "";
  const extension = name.slice(name.lastIndexOf(".")).toLowerCase();
  if (!file || file.size > MAX_BYTES || file.size <= 0 || !ALLOWED_TYPES.has(file.type) || !EXTENSIONS.has(extension)) {
    return "Use a matching PDF, PPT, PPTX, or Keynote file up to 50 MB.";
  }
  if (typeof file.arrayBuffer !== "function") return "The uploaded file could not be inspected.";
  const bytes = new Uint8Array(await file.arrayBuffer());
  return hasSignature(bytes, file.type) ? null : "The file contents do not match its declared type.";
}

export function safeFilename(name) {
  return String(name || "material").replace(/[^a-zA-Z0-9._-]/g, "-").slice(0, 160) || "material";
}

export function isUuid(value) {
  return typeof value === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}
