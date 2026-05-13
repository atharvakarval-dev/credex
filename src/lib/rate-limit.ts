import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Graceful fallback if Redis isn't configured during local dev
let redisClient: Redis | null = null;

try {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  
  if (url && token && url.startsWith("https://") && !url.includes("...")) {
    redisClient = Redis.fromEnv();
  }
} catch (error) {
  console.warn("Upstash Redis initialization failed. Rate limiting will be bypassed.", error);
}

// 10 requests per hour per IP for the audit engine
export const auditRateLimit = redisClient
  ? new Ratelimit({
      redis: redisClient,
      limiter: Ratelimit.slidingWindow(10, "1 h"),
      analytics: true,
      prefix: "@upstash/ratelimit/audit",
    })
  : null;

// 3 requests per 24 hours per IP for the lead capture
export const leadRateLimit = redisClient
  ? new Ratelimit({
      redis: redisClient,
      limiter: Ratelimit.slidingWindow(3, "24 h"),
      analytics: true,
      prefix: "@upstash/ratelimit/lead",
    })
  : null;

// 5 requests per hour per IP for AI summary streaming
export const summaryRateLimit = redisClient
  ? new Ratelimit({
      redis: redisClient,
      limiter: Ratelimit.slidingWindow(5, "1 h"),
      analytics: true,
      prefix: "@upstash/ratelimit/summary",
    })
  : null;
