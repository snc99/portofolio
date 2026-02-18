import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth } from "@/lib/with-auth";
import { ApiResponse } from "@/lib/response/api-response";
import { CreateWorkExperienceSchema } from "@/lib/validation/workExperience";

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

export const POST = withAuth(async (req: Request) => {
  try {
    const body = await req.json();

    const validation = CreateWorkExperienceSchema.safeParse(body);

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

    const isPresent = endDate === null;

    const newExperience = await prisma.workExperience.create({
      data: {
        companyName,
        position,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        isPresent,
        description: description || null,
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
    console.error(error);

    return NextResponse.json(
      ApiResponse.error("Gagal menambahkan work experience", 500),
      { status: 500 },
    );
  }
});
