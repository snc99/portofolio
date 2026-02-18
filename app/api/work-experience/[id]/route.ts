import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth } from "@/lib/with-auth";
import { ApiResponse } from "@/lib/response/api-response";
import { UpdateWorkExperienceSchema } from "@/lib/validation/workExperience";

export const PATCH = withAuth(async (req, { params }) => {
  try {
    const { id } = await params!;

    if (!id || id.trim() === "") {
      return NextResponse.json(ApiResponse.error("ID tidak valid", 400), {
        status: 400,
      });
    }

    const existing = await prisma.workExperience.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        ApiResponse.error("Work experience tidak ditemukan", 404),
        { status: 404 },
      );
    }

    const body = await req.json();

    const validation = UpdateWorkExperienceSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        ApiResponse.error(
          validation.error.errors.map((e) => e.message).join(", "),
          400,
        ),
        { status: 400 },
      );
    }

    const { companyName, position, startDate, endDate, description } =
      validation.data;

    // 🔥 Merge dengan existing
    const finalCompanyName = companyName ?? existing.companyName;

    const finalPosition = position ?? existing.position;

    const finalStartDate = startDate ? new Date(startDate) : existing.startDate;

    const finalEndDate =
      endDate !== undefined
        ? endDate
          ? new Date(endDate)
          : null
        : existing.endDate;

    const finalIsPresent = finalEndDate === null;

    const finalDescription =
      description !== undefined ? description || null : existing.description;

    // 🔥 DETEKSI PERUBAHAN
    const isCompanyChanged = finalCompanyName !== existing.companyName;

    const isPositionChanged = finalPosition !== existing.position;

    const isStartDateChanged =
      finalStartDate.getTime() !== existing.startDate.getTime();

    const isEndDateChanged =
      (existing.endDate?.getTime() ?? null) !==
      (finalEndDate?.getTime() ?? null);

    const isDescriptionChanged =
      (finalDescription ?? null) !== (existing.description ?? null);

    const isPresentChanged = finalIsPresent !== existing.isPresent;

    if (
      !isCompanyChanged &&
      !isPositionChanged &&
      !isStartDateChanged &&
      !isEndDateChanged &&
      !isDescriptionChanged &&
      !isPresentChanged
    ) {
      return NextResponse.json(
        ApiResponse.error("Minimal satu perubahan harus dilakukan", 400),
        { status: 400 },
      );
    }

    const updated = await prisma.workExperience.update({
      where: { id },
      data: {
        companyName: finalCompanyName,
        position: finalPosition,
        startDate: finalStartDate,
        endDate: finalEndDate,
        isPresent: finalIsPresent,
        description: finalDescription,
      },
    });

    return NextResponse.json(
      ApiResponse.success(updated, "Work experience berhasil diperbarui"),
      { status: 200 },
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      ApiResponse.error("Gagal memperbarui work experience", 500),
      { status: 500 },
    );
  }
});

export const DELETE = withAuth(async (req, { params }) => {
  try {
    const { id } = await params!;

    if (!id || id.trim() === "") {
      return NextResponse.json(ApiResponse.error("ID tidak valid", 400), {
        status: 400,
      });
    }

    const existing = await prisma.workExperience.findUnique({
      where: { id },
      select: {
        id: true,
        companyName: true,
      },
    });

    if (!existing) {
      return NextResponse.json(
        ApiResponse.error("Work experience tidak ditemukan", 404),
        { status: 404 },
      );
    }

    await prisma.workExperience.delete({
      where: { id },
    });

    return NextResponse.json(
      ApiResponse.success(existing, "Work experience berhasil dihapus"),
      { status: 200 },
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      ApiResponse.error(
        "Terjadi kesalahan saat menghapus work experience",
        500,
      ),
      { status: 500 },
    );
  }
});
