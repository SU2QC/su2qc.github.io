const ALLOWED_NEXT = new Set(["/", "/library", "/library/", "/upload", "/upload/"]);

export function safeNext(value) {
  return ALLOWED_NEXT.has(value) ? value : "/upload/";
}
