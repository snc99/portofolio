import { NextResponse } from "next/server";
import { authService } from "@/modules/auth/auth.service";
import { withRateLimit } from "@/shared/http/with-rate-limit";
import { SESSION_DURATION } from "@/infrastructure/security/jwt";
import { withErrorHandler } from "@/shared/http/with-error-handler";
import { sessionRepository } from "@/modules/auth/session.repository";

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

  if (!email || !password) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Email and password are required",
        },
      },
      { status: 400 },
    );
  }

  const result = await authService.login({ email, password });

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

  const { user, token } = result;

  await sessionRepository.save(user.id, token, SESSION_DURATION);

  const response = NextResponse.json(
    {
      success: true,
      message: "Login successful",
      data: {
        id: user.id,
        name: user.nama,
        email: user.email,
      },
    },
    { status: 200 },
  );

  response.cookies.set("pw_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DURATION,
  });

  return response;
}

export const POST = withErrorHandler(withRateLimit(loginHandler));
