import { NextResponse } from "next/server";
import { requireAuth } from "@/middlewares/auth";
import { authService } from "@/services/auth.service";
import { ApiResponse } from "@/lib/response/api-response";

export async function POST() {
  try {
    const user = await requireAuth();

    await authService.logout(user.id);

    const res = NextResponse.json(
      ApiResponse.success(null, "Logout berhasil"),
      { status: 200 },
    );

    // hapus cookie
    res.cookies.set("pw_token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });

    return res;
  } catch (err) {
    return NextResponse.json(ApiResponse.error("Unauthorized", 401), {
      status: 401,
    });
  }
}
