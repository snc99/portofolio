import { NextResponse } from "next/server";
import { prisma } from "@/infrastructure/database/prisma";
import { withAuth } from "@/shared/http/with-auth";
import { CreateWorkExperienceSchema } from "@/shared/validation/workExperience";
import { withErrorHandler } from "@/shared/http/with-error-handler";

export const GET = withErrorHandler(
  withAuth(async (req: Request) => {
    const { searchParams } = new URL(req.url);

    const page = Number(searchParams.get("page") ?? 1);
    const limit = Number(searchParams.get("limit") ?? 10);

    const safePage = Number.isNaN(page) || page < 1 ? 1 : page;

    const safeLimit =
      Number.isNaN(limit) || limit < 1 ? 10 : limit > 50 ? 50 : limit;

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
          location: true,
          startDate: true,
          endDate: true,
          isPresent: true,
          description: true,
        },
      }),
      prisma.workExperience.count(),
    ]);

    return NextResponse.json(
      {
        success: true,
        message: "Work experiences retrieved successfully",
        data: {
          items,
          meta: {
            page: safePage,
            limit: safeLimit,
            totalItems: total,
            totalPages: Math.ceil(total / safeLimit),
          },
        },
      },
      { status: 200 },
    );
  }),
);

export const POST = withErrorHandler(
  withAuth(async (req: Request) => {
    let body: unknown;

    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_JSON",
            message: "Request body must be valid JSON",
          },
        },
        { status: 400 },
      );
    }

    const validation = CreateWorkExperienceSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Invalid input data",
            fields: validation.error.flatten().fieldErrors,
          },
        },
        { status: 400 },
      );
    }

    const { companyName, position, location, startDate, endDate, description } =
      validation.data;

    // 🔥 Determine isPresent safely
    const isPresent = !endDate;

    const newExperience = await prisma.workExperience.create({
      data: {
        companyName,
        position,
        location: location ?? null,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        isPresent,
        description: description ?? null,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Work experience created successfully",
        data: newExperience,
      },
      { status: 201 },
    );
  }),
);
