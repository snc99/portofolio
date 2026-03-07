import { NextResponse } from "next/server";
import { requireAuth } from "@/infrastructure/security/auth";
import { userRepository } from "@/modules/user/user.repository";

export async function GET() {
  try {
    const authUser = await requireAuth();

    const user = await userRepository.findById(authUser.id);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "USER_NOT_FOUND",
            message: "User not found",
          },
        },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "User authenticated",
        data: {
          id: user.id,
          name: user.nama,
          email: user.email,
        },
      },
      { status: 200 },
    );
  } catch (error) {
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
