import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { WorkExperienceSchema } from "@/lib/validation/workExperience";
import { z } from "zod";
import { withAuth } from "@/lib/with-auth";
import { ApiResponse } from "@/lib/response/api-response";
import { withRateLimit } from "@/lib/with-rate-limit";

export const GET = withAuth(async (req: Request) => {
  try {
    const { searchParams } = new URL(req.url);

    const page = Number(searchParams.get("page") ?? 1);
    const limit = Number(searchParams.get("limit") ?? 10);

    const safePage = page < 1 ? 1 : page;
    const safeLimit = limit > 50 ? 50 : limit; // max 50 biar aman

    const skip = (safePage - 1) * safeLimit;

    const [items, total] = await Promise.all([
      prisma.workExperience.findMany({
        skip,
        take: safeLimit,
        orderBy: { startDate: "desc" },
        select: {
          id: true,
          companyName: true,
          position: true,
          startDate: true,
          endDate: true,
          isPresent: true,
          description: true,
        },
      }),
      prisma.workExperience.count(),
    ]);

    return NextResponse.json(
      ApiResponse.success(
        {
          items,
          meta: {
            page: safePage,
            limit: safeLimit,
            total,
            totalPages: Math.ceil(total / safeLimit),
          },
        },
        "Work experience berhasil diambil",
      ),
      { status: 200 },
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      ApiResponse.error("Gagal mengambil work experience", 500),
      { status: 500 },
    );
  }
});

export const POST = withAuth(
  withRateLimit(async (req: Request) => {
    try {
      const body = await req.json();

      const validatedData = WorkExperienceSchema.parse(body);

      const isPresent = validatedData.endDate === null;

      const newExperience = await prisma.workExperience.create({
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
        ApiResponse.success(
          newExperience,
          "Work experience berhasil ditambahkan",
          201,
        ),
        { status: 201 },
      );
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json(
          ApiResponse.error(error.errors.map((e) => e.message).join(", "), 400),
          { status: 400 },
        );
      }

      console.error(error);

      return NextResponse.json(
        ApiResponse.error("Gagal menambahkan work experience", 500),
        { status: 500 },
      );
    }
  }, 10),
);
