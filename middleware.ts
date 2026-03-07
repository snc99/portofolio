import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("pw_token")?.value;
  const { pathname, origin } = request.nextUrl;

  const isAuthPage = pathname.startsWith("/auth");
  const isDashboardPage = pathname.startsWith("/dashboard");

  // 🔒 Tidak ada token
  if (!token) {
    if (isDashboardPage) {
      return redirectLogin(request);
    }
    return NextResponse.next();
  }

  // 🔍 Verifikasi JWT
  let payload: any;
  try {
    const verified = await jwtVerify(token, secret);
    payload = verified.payload;
  } catch {
    return redirectLogin(request);
  }

  // 🔍 Cek Redis session aktif via internal API
  try {
    const res = await fetch(`${origin}/api/auth/session-check`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      return redirectLogin(request);
    }
  } catch {
    return redirectLogin(request);
  }

  // 🚫 Sudah login tapi buka auth page
  if (isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // ✅ Token valid & aktif
  return NextResponse.next();
}

function redirectLogin(request: NextRequest) {
  const res = NextResponse.redirect(new URL("/auth/login", request.url));
  res.cookies.set("pw_token", "", { maxAge: 0 });
  return res;
}

export const config = {
  matcher: ["/dashboard/:path*", "/auth/:path*"],
};
