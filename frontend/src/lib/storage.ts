/** Tiny typed localStorage wrapper. All EasePal data lives on-device. */

const PREFIX = "easepal:";

export function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    if (raw == null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function save<T>(key: string, value: T): void {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    /* storage full or unavailable — non-fatal for a wellness companion */
  }
}

export function remove(key: string): void {
  try {
    localStorage.removeItem(PREFIX + key);
  } catch {
    /* ignore */
  }
}

export const uid = (): string =>
  Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

const DAY = 86_400_000;

/** Consecutive-day streak ending today (or yesterday) from a list of timestamps. */
export function computeStreak(timestamps: number[]): number {
  if (timestamps.length === 0) return 0;
  const days = new Set(
    timestamps.map((t) => Math.floor(t / DAY))
  );
  const today = Math.floor(Date.now() / DAY);
  // Allow the streak to be "alive" if the last activity was today or yesterday.
  let cursor = days.has(today) ? today : days.has(today - 1) ? today - 1 : -1;
  if (cursor === -1) return 0;
  let streak = 0;
  while (days.has(cursor)) {
    streak += 1;
    cursor -= 1;
  }
  return streak;
}
