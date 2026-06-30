import { connectDB } from '@/lib/db/connection';
import { RateLimit } from '@/lib/db/models/RateLimit.model';

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  /** Milliseconds until the current window resets (0 when allowed on a fresh window). */
  retryAfterMs: number;
}

/**
 * Fixed-window rate limiter backed by MongoDB (TTL-reaped). Each call consumes
 * one unit for `key`. Suitable for serverless: state lives in the shared DB,
 * not in per-instance memory.
 */
export async function consumeRateLimit(
  key: string,
  limit: number,
  windowMs: number
): Promise<RateLimitResult> {
  await connectDB();
  const now = Date.now();

  const existing = await RateLimit.findOne({ key }).lean();

  // No live window → start a fresh one.
  if (!existing || existing.expiresAt.getTime() <= now) {
    await RateLimit.findOneAndUpdate(
      { key },
      { $set: { count: 1, expiresAt: new Date(now + windowMs) } },
      { upsert: true }
    );
    return { allowed: true, remaining: limit - 1, retryAfterMs: 0 };
  }

  const retryAfterMs = existing.expiresAt.getTime() - now;

  if (existing.count >= limit) {
    return { allowed: false, remaining: 0, retryAfterMs };
  }

  const updated = await RateLimit.findOneAndUpdate(
    { key },
    { $inc: { count: 1 } },
    { new: true }
  ).lean();

  return {
    allowed: true,
    remaining: Math.max(0, limit - (updated?.count ?? limit)),
    retryAfterMs,
  };
}

/** Best-effort client IP from proxy headers (Vercel/Cloudflare set these). */
export function clientIp(req: Request): string {
  const fwd = req.headers.get('x-forwarded-for');
  if (fwd) return fwd.split(',')[0].trim();
  return req.headers.get('x-real-ip')?.trim() || 'unknown';
}
