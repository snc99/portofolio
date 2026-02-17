import { NextResponse } from "next/server";
import { requireAuth } from "@/middlewares/require-auth";
import { ApiResponse } from "@/lib/response/api-response";

type AppRouteContext = {
  params?: Promise<Record<string, string>>;
};

export function withAuth<T extends AppRouteContext = AppRouteContext>(
  handler: (req: Request, context: T) => Promise<NextResponse>,
) {
  return async (req: Request, context: T) => {
    try {
      await requireAuth(req);
      return handler(req, context);
    } catch {
      return NextResponse.json(ApiResponse.error("Unauthorized", 401), {
        status: 401,
      });
    }
  };
}
