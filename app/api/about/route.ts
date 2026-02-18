import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { CreateAboutSchema, UpdateAboutSchema } from "@/lib/validation/about";
import { ApiResponse } from "@/lib/response/api-response";
import { withAuth } from "@/lib/with-auth";

export const GET = withAuth(async () => {
  const about = await prisma.about.findFirst({
    select: {
      id: true,
      description: true,
    },
  });

  return NextResponse.json(
    ApiResponse.success(about, "Data about berhasil diambil"),
    { status: 200 },
  );
});

export const POST = withAuth(async (req: Request) => {
  try {
    const body = await req.json();

    const parsed = CreateAboutSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        ApiResponse.error(
          parsed.error.errors.map((e) => e.message).join(", "),
          400,
        ),
        { status: 400 },
      );
    }

    // karena singleton → cek dulu
    const existing = await prisma.about.findFirst();
    if (existing) {
      return NextResponse.json(
        ApiResponse.error("Data about sudah ada. Gunakan update.", 400),
        { status: 400 },
      );
    }

    const about = await prisma.about.create({
      data: {
        description: parsed.data.description,
      },
    });

    return NextResponse.json(
      ApiResponse.success(about, "About berhasil dibuat", 201),
      { status: 201 },
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(ApiResponse.error("Gagal membuat about", 500), {
      status: 500,
    });
  }
});

export const PUT = withAuth(async (req: Request) => {
  try {
    const body = await req.json();

    const parsed = UpdateAboutSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        ApiResponse.error(
          parsed.error.errors[0]?.message || "Input tidak valid",
          400,
        ),
        { status: 400 },
      );
    }

    const existing = await prisma.about.findFirst();

    if (!existing) {
      // kalau belum ada → create
      const created = await prisma.about.create({
        data: {
          description: parsed.data.description!,
        },
      });

      return NextResponse.json(
        ApiResponse.success(created, "About berhasil dibuat"),
        { status: 201 },
      );
    }

    const newDescription = parsed.data.description?.trim();

    // minimal 1 perubahan
    if (!newDescription || newDescription === existing.description) {
      return NextResponse.json(
        ApiResponse.error("Minimal satu perubahan harus dilakukan", 400),
        { status: 400 },
      );
    }

    const updated = await prisma.about.update({
      where: { id: existing.id },
      data: {
        description: newDescription,
      },
    });

    return NextResponse.json(
      ApiResponse.success(updated, "About berhasil diperbarui"),
      { status: 200 },
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(ApiResponse.error("Gagal update about", 500), {
      status: 500,
    });
  }
});

export const DELETE = withAuth(async () => {
  try {
    const existing = await prisma.about.findFirst();

    if (!existing) {
      return NextResponse.json(
        ApiResponse.error("Data about tidak ditemukan", 404),
        { status: 404 },
      );
    }

    await prisma.about.delete({
      where: { id: existing.id },
    });

    return NextResponse.json(
      ApiResponse.success(null, "About berhasil dihapus"),
      { status: 200 },
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(ApiResponse.error("Gagal menghapus about", 500), {
      status: 500,
    });
  }
});
