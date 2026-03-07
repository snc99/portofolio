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

  // 🔴 Basic validation
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

  // 🔐 Authenticate user
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

  const { user, token } = result;

  // ✅ Simpan session aktif ke Redis (single-device login)
  await sessionRepository.save(user.id, token, SESSION_DURATION);

  // 🟢 Success response
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

  // 🍪 Set HttpOnly cookie
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
