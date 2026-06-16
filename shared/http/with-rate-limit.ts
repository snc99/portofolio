import { NextResponse } from "next/server";
import { ApiResponse } from "@/shared/response/api-response.util";
import { LRUCache } from "lru-cache";

const FREEZE_DURATION = 1000 * 60 * 30; // 30 menit
// const FREEZE_DURATION = 10_000; // 10 detik untuk testing

const cache = new LRUCache<string, number>({
  max: 500,
  ttl: FREEZE_DURATION,
});

type AppRouteContext = {
  params?: Promise<Record<string, string>>;
};

export function withRateLimit<T extends AppRouteContext = AppRouteContext>(
  handler: (req: Request, context: T) => Promise<NextResponse>,
  limit = 3,
) {
  return async (req: Request, context: T) => {
    const ip = req.headers.get("x-forwarded-for") ?? "unknown";
    const count = cache.get(ip) ?? 0;

    if (count >= limit) {
      const remainingMs = cache.getRemainingTTL(ip) ?? 0;
      const remainingMinutes = Math.ceil(remainingMs / 1000 / 60);

      if (count === limit) {
        cache.set(ip, count + 1);

        return ApiResponse.error(
          "You have been temporarily locked out for 30 minutes.",
          "RATE_LIMIT",
          429,
        );
      }

      return ApiResponse.error(
        `You are still temporarily locked out. ${remainingMinutes} minutes remaining.`,
        "RATE_LIMIT",
        429,
      );
    }

    cache.set(ip, count + 1);

    return handler(req, context);
  };
}
