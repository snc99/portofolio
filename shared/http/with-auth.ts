import { NextResponse } from "next/server";
import { requireAuth } from "@/infrastructure/security/auth";

export function withAuth<
  TContext extends Record<string, any> = Record<string, any>,
>(handler: (req: Request, context: TContext) => Promise<Response>) {
  return async (req: Request, context: TContext) => {
    try {
      await requireAuth();
      return handler(req, context);
    } catch {
      return NextResponse.json(
        {
          code: "UNAUTHORIZED",
          message: "Unauthorized",
        },
        { status: 401 },
      );
    }
  };
}
