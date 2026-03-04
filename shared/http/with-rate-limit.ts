import { NextResponse } from "next/server";
import { ApiResponse } from "@/shared/response/api-response.util";
import { LRUCache } from "lru-cache";

const FREEZE_DURATION = 1000 * 10;
// 1000 * 60 * 30; // 30 menit

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

    // Sudah kena limit
    if (count >= limit) {
      const remainingMs = cache.getRemainingTTL(ip) ?? 0;
      const remainingMinutes = Math.ceil(remainingMs / 1000 / 60);

      // kondisi pertama kali freeze
      if (count === limit) {
        cache.set(ip, count + 1); // naikin supaya masuk kondisi ke-2 berikutnya

        return NextResponse.json(
          ApiResponse.error("Anda di-freeze selama 30 menit", 429),
          { status: 429 },
        );
      }

      // kondisi sudah dalam freeze
      return NextResponse.json(
        ApiResponse.error(
          `Anda masih dalam freeze, sisa ${remainingMinutes} menit`,
          429,
        ),
        { status: 429 },
      );
    }

    cache.set(ip, count + 1);

    return handler(req, context);
  };
}
