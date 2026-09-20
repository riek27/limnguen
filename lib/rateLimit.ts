// Simple in-memory rate limiter for login attempts.
// For multi-instance deployments, swap this for Redis/Upstash.

type AttemptRecord = {
  count: number;
  firstAttempt: number;   // ms
  blockedUntil: number;   // ms — 0 = not blocked
};

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;       // 15 minutes
const BLOCK_MS = 15 * 60 * 1000;        // 15 minutes block

// Global store — survives across requests in the same process
const store: Map<string, AttemptRecord> = (globalThis as any).__lnfRateLimitStore || new Map();
(globalThis as any).__lnfRateLimitStore = store;

export function getClientIp(request: Request): string {
  const headers = request.headers;
  const forwarded = headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  const real = headers.get('x-real-ip');
  if (real) return real.trim();
  const cf = headers.get('cf-connecting-ip');
  if (cf) return cf.trim();
  return 'unknown';
}

export type RateLimitResult = {
  allowed: boolean;
  remainingAttempts: number;
  blockedUntil: number;          // ms timestamp (0 if not blocked)
  retryAfterSeconds: number;     // seconds until unblock
};

export function checkRateLimit(key: string): RateLimitResult {
  const now = Date.now();
  const rec = store.get(key);

  // No record → allowed
  if (!rec) {
    return {
      allowed: true,
      remainingAttempts: MAX_ATTEMPTS,
      blockedUntil: 0,
      retryAfterSeconds: 0,
    };
  }

  // Currently blocked?
  if (rec.blockedUntil > now) {
    return {
      allowed: false,
      remainingAttempts: 0,
      blockedUntil: rec.blockedUntil,
      retryAfterSeconds: Math.ceil((rec.blockedUntil - now) / 1000),
    };
  }

  // Block expired → clear record
  if (rec.blockedUntil > 0 && rec.blockedUntil <= now) {
    store.delete(key);
    return {
      allowed: true,
      remainingAttempts: MAX_ATTEMPTS,
      blockedUntil: 0,
      retryAfterSeconds: 0,
    };
  }

  // Attempt window expired → start fresh
  if (now - rec.firstAttempt > WINDOW_MS) {
    store.delete(key);
    return {
      allowed: true,
      remainingAttempts: MAX_ATTEMPTS,
      blockedUntil: 0,
      retryAfterSeconds: 0,
    };
  }

  // Within window, not yet blocked
  return {
    allowed: true,
    remainingAttempts: Math.max(0, MAX_ATTEMPTS - rec.count),
    blockedUntil: 0,
    retryAfterSeconds: 0,
  };
}

export function recordFailedAttempt(key: string): RateLimitResult {
  const now = Date.now();
  const rec = store.get(key);

  // If currently blocked, just return the existing state
  if (rec && rec.blockedUntil > now) {
    return {
      allowed: false,
      remainingAttempts: 0,
      blockedUntil: rec.blockedUntil,
      retryAfterSeconds: Math.ceil((rec.blockedUntil - now) / 1000),
    };
  }

  // Start a new record if window expired or none exists
  let current: AttemptRecord;
  if (!rec || now - rec.firstAttempt > WINDOW_MS) {
    current = { count: 1, firstAttempt: now, blockedUntil: 0 };
  } else {
    current = { ...rec, count: rec.count + 1 };
  }

  // Check if we should block
  if (current.count >= MAX_ATTEMPTS) {
    current.blockedUntil = now + BLOCK_MS;
    store.set(key, current);
    return {
      allowed: false,
      remainingAttempts: 0,
      blockedUntil: current.blockedUntil,
      retryAfterSeconds: Math.ceil(BLOCK_MS / 1000),
    };
  }

  store.set(key, current);
  return {
    allowed: true,
    remainingAttempts: MAX_ATTEMPTS - current.count,
    blockedUntil: 0,
    retryAfterSeconds: 0,
  };
}

export function clearAttempts(key: string): void {
  store.delete(key);
}