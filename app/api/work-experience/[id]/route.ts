import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { WorkExperienceSchema } from "@/lib/validation/workExperience";
import { z } from "zod";
import { withAuth } from "@/lib/with-auth";
import { withRateLimit } from "@/lib/with-rate-limit";
import { ApiResponse } from "@/lib/response/api-response";

export const PUT = withAuth(
  withRateLimit<{ params: Promise<{ id: string }> }>(
    async (req, { params }) => {
      try {
        const { id } = await params;

        const body = await req.json();
        const validatedData = WorkExperienceSchema.parse(body);

        const existing = await prisma.workExperience.findUnique({
          where: { id },
        });

        if (!existing) {
          return NextResponse.json(
            ApiResponse.error("Work experience tidak ditemukan", 404),
            { status: 404 },
          );
        }

        const isPresent = !validatedData.endDate;

        const updated = await prisma.workExperience.update({
          where: { id },
          data: {
            companyName: validatedData.companyName,
            position: validatedData.position,
            startDate: new Date(validatedData.startDate),
            endDate: validatedData.endDate
              ? new Date(validatedData.endDate)
              : null,
            isPresent,
            description: validatedData.description || null,
          },
        });

        return NextResponse.json(
          ApiResponse.success(updated, "Work experience berhasil diperbarui"),
          { status: 200 },
        );
      } catch (error) {
        if (error instanceof z.ZodError) {
          return NextResponse.json(
            ApiResponse.error(
              error.errors.map((e) => e.message).join(", "),
              400,
            ),
            { status: 400 },
          );
        }

        console.error(error);

        return NextResponse.json(
          ApiResponse.error("Gagal memperbarui work experience", 500),
          { status: 500 },
        );
      }
    },
    10,
  ),
);

export const DELETE = withAuth(
  withRateLimit(async (req, { params }) => {
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
  }, 10),
);
