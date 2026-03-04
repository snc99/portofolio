import { NextResponse } from "next/server";
import { authService } from "@/modules/auth/auth.service";
import { withRateLimit } from "@/shared/http/with-rate-limit";
import { SESSION_DURATION } from "@/infrastructure/security/jwt";
import { withErrorHandler } from "@/shared/http/with-error-handler";

async function loginHandler(req: Request) {
  let body: unknown;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INVALID_JSON",
          message: "Request body must be valid JSON",
        },
      },
      { status: 400 },
    );
  }

  const { email, password } = body as {
    email?: string;
    password?: string;
  };

  // 🔴 Basic validation
  if (!email || !password) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Email and password are required",
          fields: {
            ...(!email && { email: ["Email is required"] }),
            ...(!password && { password: ["Password is required"] }),
          },
        },
      },
      { status: 400 },
    );
  }

  const result = await authService.login({ email, password });

  // 🔴 Invalid credentials
  if (!result) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INVALID_CREDENTIALS",
          message: "Email or password is incorrect",
        },
      },
      { status: 401 },
    );
  }

  // 🟢 Success
  const response = NextResponse.json(
    {
      success: true,
      message: "Login successful",
      data: result.user,
    },
    { status: 200 },
  );

  response.cookies.set("pw_token", result.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DURATION,
  });

  return response;
}

export const POST = withErrorHandler(withRateLimit(loginHandler));
