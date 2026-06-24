import { RateLimiterMemory } from "rate-limiter-flexible";

// Prevent recreation of limiters during Next.js development hot-reloads
declare global {
  var globalLoginLimiter: RateLimiterMemory | undefined;
  var globalOtpLimiter: RateLimiterMemory | undefined;
}

export const loginLimiter =
  globalThis.globalLoginLimiter ||
  new RateLimiterMemory({
    points: 5,
    duration: 15 * 60, // 15 minutes in seconds
  });

export const otpLimiter =
  globalThis.globalOtpLimiter ||
  new RateLimiterMemory({
    points: 5,
    duration: 5 * 60, // 5 minutes in seconds
  });

if (process.env.NODE_ENV !== "production") {
  globalThis.globalLoginLimiter = loginLimiter;
  globalThis.globalOtpLimiter = otpLimiter;
}
