import { NextResponse } from "next/server";
import { requireAuth } from "@/infrastructure/security/auth";
import { sessionRepository } from "@/modules/auth/session.repository";

export async function POST() {
  try {
    const user = await requireAuth();

    await sessionRepository.delete(user.id);

    const response = NextResponse.json(
      {
        success: true,
        message: "Logout successful",
        data: null,
      },
      { status: 200 },
    );

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
