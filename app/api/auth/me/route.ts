import { NextResponse } from "next/server";
import { requireAuth } from "@/middlewares/auth";
import { prisma } from "@/lib/prisma";
import { ApiResponse } from "@/lib/response/api-response";

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
      return NextResponse.json(ApiResponse.error("User tidak ditemukan", 404), {
        status: 404,
      });
    }

    return NextResponse.json(
      ApiResponse.success(admin, "Profil berhasil diambil"),
      { status: 200 },
    );
  } catch (err) {
    return NextResponse.json(ApiResponse.error("Unauthorized", 401), {
      status: 401,
    });
  }
}
