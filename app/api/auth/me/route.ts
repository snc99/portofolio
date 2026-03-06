import { NextResponse } from "next/server";
import { requireAuth } from "@/infrastructure/security/auth";
import { userRepository } from "@/modules/user/user.repository";

export async function GET() {
  try {
    const user = await requireAuth();

    const admin = await userRepository.findById(user.id);

    if (!admin) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "ADMIN_NOT_FOUND",
            message: "User not found",
          },
        },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Profile retrieved successfully",
        data: {
          id: admin.id,
          name: admin.nama,
          email: admin.email,
        },
      },
      { status: 200 },
    );
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
