export const MAX_BYTES = 50 * 1024 * 1024;
export const ALLOWED_TYPES = new Set([
  "application/pdf", "application/vnd.ms-powerpoint", "application/vnd.openxmlformats-officedocument.presentationml.presentation", "application/vnd.apple.keynote", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/vnd.oasis.opendocument.text", "application/vnd.oasis.opendocument.presentation", "text/markdown", "text/plain", "text/x-tex", "text/x-python", "text/javascript", "application/javascript", "text/typescript", "text/x-c", "text/x-c++", "text/x-rust", "text/x-go", "text/x-java-source", "application/x-ipynb+json", "application/zip",
]);
const EXTENSIONS = new Set([".pdf", ".ppt", ".pptx", ".key", ".doc", ".docx", ".odt", ".odp", ".md", ".markdown", ".txt", ".tex", ".latex", ".py", ".js", ".jsx", ".ts", ".tsx", ".c", ".h", ".cpp", ".hpp", ".rs", ".go", ".java", ".ipynb", ".zip"]);
const EXTENSION_TYPES = { ".pdf": ["application/pdf"], ".ppt": ["application/vnd.ms-powerpoint"], ".pptx": ["application/vnd.openxmlformats-officedocument.presentationml.presentation"], ".key": ["application/vnd.apple.keynote"], ".doc": ["application/msword"], ".docx": ["application/vnd.openxmlformats-officedocument.wordprocessingml.document"], ".odt": ["application/vnd.oasis.opendocument.text"], ".odp": ["application/vnd.oasis.opendocument.presentation"], ".md": ["text/markdown"], ".markdown": ["text/markdown"], ".txt": ["text/plain"], ".tex": ["text/x-tex"], ".latex": ["text/x-tex"], ".py": ["text/x-python"], ".js": ["text/javascript", "application/javascript"], ".jsx": ["text/javascript", "application/javascript"], ".ts": ["text/typescript"], ".tsx": ["text/typescript"], ".c": ["text/x-c"], ".h": ["text/x-c"], ".cpp": ["text/x-c++"], ".hpp": ["text/x-c++"], ".rs": ["text/x-rust"], ".go": ["text/x-go"], ".java": ["text/x-java-source"], ".ipynb": ["application/x-ipynb+json"], ".zip": ["application/zip"] };
const CONTAINER_TYPES = new Set(["application/vnd.openxmlformats-officedocument.presentationml.presentation", "application/vnd.apple.keynote", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/vnd.oasis.opendocument.text", "application/vnd.oasis.opendocument.presentation", "application/zip"]);
const TEXT_TYPES = new Set([...ALLOWED_TYPES].filter(type => type.startsWith("text/") || type === "application/javascript" || type === "application/x-ipynb+json"));

function isText(bytes) {
  if (bytes.includes(0)) return false;
  try { new TextDecoder("utf-8", { fatal: true }).decode(bytes); return true; } catch { return false; }
}

function hasSignature(bytes, type, extension) {
  if (type === "application/pdf") return new TextDecoder().decode(bytes.slice(0, 5)) === "%PDF-";
  if (type === "application/vnd.ms-powerpoint" || type === "application/msword") return bytes.length >= 8 && bytes.slice(0, 8).every((value, index) => value === [0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1][index]);
  if (CONTAINER_TYPES.has(type)) return bytes.length >= 2 && bytes[0] === 0x50 && bytes[1] === 0x4b;
  if (TEXT_TYPES.has(type)) {
    if (!isText(bytes)) return false;
    if (extension === ".ipynb") { try { const value = JSON.parse(new TextDecoder().decode(bytes)); return value && typeof value === "object" && Array.isArray(value.cells) && value.metadata && typeof value.metadata === "object"; } catch { return false; } }
    return true;
  }
  return false;
}

export async function validateMaterialFile(file) {
  const name = typeof file?.name === "string" ? file.name : "";
  const extension = name.slice(name.lastIndexOf(".")).toLowerCase();
  if (!file || file.size > MAX_BYTES || file.size <= 0 || !ALLOWED_TYPES.has(file.type) || !EXTENSIONS.has(extension) || !EXTENSION_TYPES[extension]?.includes(file.type)) return "Use an allowed research file up to 50 MB with a matching extension and MIME type.";
  if (typeof file.arrayBuffer !== "function") return "The uploaded file could not be inspected.";
  const bytes = new Uint8Array(await file.arrayBuffer());
  return hasSignature(bytes, file.type, extension) ? null : "The file contents do not match its declared type.";
}

export function safeFilename(name) { return String(name || "material").replace(/[^a-zA-Z0-9._-]/g, "-").slice(0, 160) || "material"; }
export function isUuid(value) { return typeof value === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value); }
