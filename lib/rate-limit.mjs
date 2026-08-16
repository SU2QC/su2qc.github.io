const buckets = new Map();

export function allowRequest(key, limit = 5, windowMs = 15 * 60 * 1000) {
  const now = Date.now();
  const bucket = buckets.get(key);
  if (!bucket || now - bucket.started >= windowMs) {
    buckets.set(key, { started: now, count: 1 });
    return true;
  }
  if (bucket.count >= limit) return false;
  bucket.count += 1;
  return true;
}

// ponytail: process-local limiter; use an edge/distributed limiter when multiple instances need one shared quota.
