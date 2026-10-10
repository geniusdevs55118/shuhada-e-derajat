const WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILURES = 5;

const attempts = new Map<string, number[]>();

export function keyFor(username: string, ip: string): string {
  return `${username.toLowerCase()}:${ip}`;
}

export function isRateLimited(key: string): boolean {
  const now = Date.now();
  const list = (attempts.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  attempts.set(key, list);
  return list.length >= MAX_FAILURES;
}

export function recordFailure(key: string): void {
  const now = Date.now();
  const list = (attempts.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  list.push(now);
  attempts.set(key, list);
}

export function resetFailures(key: string): void {
  attempts.delete(key);
}

export function _clearAll(): void {
  attempts.clear();
}
