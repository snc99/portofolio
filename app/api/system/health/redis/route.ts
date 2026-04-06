import { redis } from "@/infrastructure/cache/redis";
import { ApiResponse } from "@/shared/response/api-response.util";
import { formatTimestamp } from "@/shared/utils/formateDate";
import { NextResponse } from "next/server";

export async function GET() {
  const start = Date.now();

  try {
    await redis.ping();

    const latency = Date.now() - start;

    return NextResponse.json(
      {
        ...ApiResponse.success(
          { service: "redis", status: "ok" },
          "Redis is reachable",
        ),
        timestamp: formatTimestamp(),
        latency: `${latency}ms`,
      },
      { status: 200 },
    );
  } catch {
    const latency = Date.now() - start;

    return NextResponse.json(
      {
        ...ApiResponse.error(
          "Redis is not reachable",
          "REDIS_CONNECTION_ERROR",
        ),
        timestamp: formatTimestamp(),
        latency: `${latency}ms`,
      },
      { status: 500 },
    );
  }
}
