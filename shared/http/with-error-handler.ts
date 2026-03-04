// shared/http/with-error-handler.ts

import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

export function withErrorHandler<
  TContext extends Record<string, any> = Record<string, any>,
>(handler: (req: Request, context: TContext) => Promise<Response>) {
  return async (req: Request, context: TContext) => {
    try {
      return await handler(req, context);
    } catch (error) {
      console.error("GLOBAL ERROR:", error);

      // 🔴 Prisma DB Initialization Error (DB down)
      if (error instanceof Prisma.PrismaClientInitializationError) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: "DATABASE_UNAVAILABLE",
              message: "Database service is unavailable",
            },
          },
          { status: 503 },
        );
      }

      // 🔴 Prisma Known Request Error (query issue)
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: "DATABASE_ERROR",
              message: "A database error occurred",
            },
          },
          { status: 500 },
        );
      }

      // 🔴 Fallback
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INTERNAL_SERVER_ERROR",
            message: "An unexpected error occurred",
          },
        },
        { status: 500 },
      );
    }
  };
}
