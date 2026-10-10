const buckets = new Map<string, number[]>();

export function rateLimitCheck(key: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  const list = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);
  buckets.set(key, list);
  if (list.length >= max) return false;
  list.push(now);
  return true;
}

export function rateLimitReset(key?: string) {
  if (key) buckets.delete(key);
  else buckets.clear();
}
