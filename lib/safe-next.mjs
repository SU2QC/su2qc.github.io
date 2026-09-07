const ALLOWED_NEXT = new Set(["/", "/library", "/library/", "/upload", "/upload/", "/vault", "/vault/", "/my-materials", "/my-materials/"]);

export function safeNext(value) {
  return ALLOWED_NEXT.has(value) ? value : "/upload/";
}
