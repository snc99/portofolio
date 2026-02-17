import { NextResponse } from "next/server";
import { ApiResponse } from "@/lib/response/api-response";
import { authService } from "@/services/auth.service";
import { withRateLimit } from "@/lib/with-rate-limit";

async function loginHandler(req: Request) {
  const body = await req.json();
  const { email, password } = body;

  const result = await authService.login(email, password);

  if (!result) {
    return NextResponse.json(
      ApiResponse.error("Email atau password salah", 401),
      { status: 401 },
    );
  }

  const res = NextResponse.json(
    ApiResponse.success(result.user, "Login berhasil"),
    { status: 200 },
  );

  res.cookies.set("pw_token", result.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  return res;
}

export const POST = withRateLimit(loginHandler);
