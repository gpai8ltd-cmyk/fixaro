/**
 * In-memory rate limiter for API routes.
 * NOTE: On multi-instance deployments (e.g. Vercel serverless), each instance
 * has its own store. For strict enforcement across instances, replace with Redis/Upstash.
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

// Clean up expired entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetTime < now) {
      rateLimitStore.delete(key);
    }
  }
}, 60000); // Clean every minute

interface RateLimitConfig {
  windowMs: number;  // Time window in milliseconds
  maxRequests: number;  // Max requests per window
}

interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetTime: number;
}

/**
 * Check rate limit for a given identifier (usually IP address)
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): RateLimitResult {
  const now = Date.now();
  const entry = rateLimitStore.get(identifier);

  // First request or window expired
  if (!entry || entry.resetTime < now) {
    rateLimitStore.set(identifier, {
      count: 1,
      resetTime: now + config.windowMs,
    });
    return {
      success: true,
      remaining: config.maxRequests - 1,
      resetTime: now + config.windowMs,
    };
  }

  // Within window, check count
  if (entry.count >= config.maxRequests) {
    return {
      success: false,
      remaining: 0,
      resetTime: entry.resetTime,
    };
  }

  // Increment count
  entry.count++;
  return {
    success: true,
    remaining: config.maxRequests - entry.count,
    resetTime: entry.resetTime,
  };
}

/**
 * Get client IP from request headers.
 * Uses x-real-ip (set by trusted proxies like Vercel/nginx) as primary source.
 * Falls back to x-forwarded-for — takes the LAST entry which is appended by
 * the trusted proxy (attackers can only inject IPs at the beginning).
 */
export function getClientIp(request: Request): string {
  // x-real-ip is set by Vercel/nginx and cannot be spoofed by clients
  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp.trim();
  }

  // x-forwarded-for: take the last entry (added by the trusted proxy)
  // NOT the first entry, which can be injected by an attacker
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    const ips = forwarded.split(',').map((ip) => ip.trim());
    return ips[ips.length - 1];
  }

  return 'unknown';
}

// Pre-configured rate limiters
export const loginRateLimit: RateLimitConfig = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5,            // 5 attempts per 15 minutes
};

export const apiRateLimit: RateLimitConfig = {
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 60,     // 60 requests per minute
};

export const orderRateLimit: RateLimitConfig = {
  windowMs: 60 * 60 * 1000, // 1 hour
  maxRequests: 10,           // 10 orders per hour per IP (anti-spam)
};

export const elevenLabsRateLimit: RateLimitConfig = {
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 5,      // 5 signed URL requests per minute per IP
};
