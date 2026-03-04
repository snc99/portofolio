import { NextResponse } from "next/server";
import { requireAuth } from "@/infrastructure/security/auth";

export async function POST() {
  try {
    await requireAuth();

    const response = NextResponse.json(
      {
        success: true,
        message: "Logout successful",
        data: null,
      },
      { status: 200 },
    );

    // Hapus cookie
    response.cookies.set("pw_token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });

    return response;
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "UNAUTHORIZED",
          message: "Unauthorized",
        },
      },
      { status: 401 },
    );
  }
}
