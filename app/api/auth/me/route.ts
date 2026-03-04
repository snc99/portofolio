import { NextResponse } from "next/server";
import { requireAuth } from "@/infrastructure/security/auth";
import { prisma } from "@/infrastructure/database/prisma";

export async function GET() {
  try {
    const user = await requireAuth();

    const admin = await prisma.admin.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        nama: true,
        email: true,
      },
    });

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
          name: admin.nama, // mapping tetap di BE (ini bagus)
          email: admin.email,
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
