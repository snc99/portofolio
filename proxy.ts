
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { sessionRepository } from "@/modules/auth/session.repository";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function proxy(request: NextRequest) {
  const token = request.cookies.get("pw_token")?.value;
  const { pathname } = request.nextUrl;

  const isAuthPage = pathname.startsWith("/auth");
  const isDashboardPage = pathname.startsWith("/dashboard");

  console.log("[AUTH DEBUG]", {
    pathname,
    hasToken: Boolean(token),
  });

  if (!token) {
    if (isDashboardPage) {
      return redirectLogin(request);
    }

    return NextResponse.next();
  }

  try {
    const verified = await jwtVerify(token, secret);
    const userId = verified.payload.id;

    if (typeof userId !== "string") {
      return redirectLogin(request);
    }

    const activeToken = await sessionRepository.get(userId);

    if (!activeToken || activeToken !== token) {
      console.error("[AUTH DEBUG] Session tidak valid");
      return redirectLogin(request);
    }
  } catch (error) {
    console.error("[AUTH DEBUG] Validasi autentikasi gagal:", error);
    return redirectLogin(request);
  }

  if (isAuthPage) {
    return NextResponse.redirect(
      new URL("/dashboard", request.url),
    );
  }

  return NextResponse.next();
}

function redirectLogin(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/auth")) {
    return NextResponse.next();
  }

  const response = NextResponse.redirect(
    new URL("/auth/login", request.url),
  );

  response.cookies.set("pw_token", "", {
    maxAge: 0,
    path: "/",
  });

  return response;
}

export const config = {
  matcher: ["/dashboard/:path*", "/auth/:path*"],
};
