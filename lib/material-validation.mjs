export const MAX_BYTES = 50 * 1024 * 1024;
export const ALLOWED_TYPES = new Set([
  "application/pdf",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/vnd.apple.keynote",
]);

const EXTENSIONS = new Set([".pdf", ".ppt", ".pptx", ".key"]);

function hasSignature(bytes, type) {
  if (type === "application/pdf") return new TextDecoder().decode(bytes.slice(0, 5)) === "%PDF-";
  if (type === "application/vnd.ms-powerpoint") return bytes.length >= 8 && bytes.slice(0, 8).every((value, index) => value === [0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1][index]);
  return bytes[0] === 0x50 && bytes[1] === 0x4b;
}

export async function validateMaterialFile(file) {
  const extension = typeof file?.name === "string" ? file.name.slice(file.name.lastIndexOf(".")).toLowerCase() : "";
  if (!file || file.size > MAX_BYTES || !ALLOWED_TYPES.has(file.type) || !EXTENSIONS.has(extension)) return "Use a matching PDF, PPT, PPTX, or Keynote file up to 50 MB.";
  if (typeof file.arrayBuffer !== "function") return "The uploaded file could not be inspected.";
  const bytes = new Uint8Array(await file.arrayBuffer());
  if (!hasSignature(bytes, file.type)) return "The file contents do not match its declared type.";
  return null;
}
