import { NextResponse } from "next/server";
import { prisma } from "@/infrastructure/database/prisma";
import { CreateSkillSchema } from "@/shared/validation/skillSchema";
import { uploadToCloudinary } from "@/infrastructure/storage/cloudinary";
import { withAuth } from "@/shared/http/with-auth";
import { withErrorHandler } from "@/shared/http/with-error-handler";

export const GET = withErrorHandler(
  withAuth(async (req: Request) => {
    const { searchParams } = new URL(req.url);

    const page = Number(searchParams.get("page") ?? 1);
    const limit = Number(searchParams.get("limit") ?? 10);

    const safePage = page < 1 || Number.isNaN(page) ? 1 : page;
    const safeLimit =
      limit < 1 || Number.isNaN(limit) ? 10 : limit > 50 ? 50 : limit;

    const skip = (safePage - 1) * safeLimit;

    const [items, total] = await Promise.all([
      prisma.skill.findMany({
        skip,
        take: safeLimit,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          photo: true,
          level: true, // ✅ ENUM BARU
          createdAt: true,
        },
      }),
      prisma.skill.count(),
    ]);

    return NextResponse.json(
      {
        success: true,
        message: "Skills retrieved successfully",
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
    const formData = await req.formData();

    const validation = CreateSkillSchema.safeParse({
      name: formData.get("name"),
      photo: formData.get("photo"),
      level: formData.get("level"),
    });

    // 🔴 Validation error
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

    const { name, photo, level } = validation.data;

    // 🔴 Duplicate check (case insensitive)
    const existing = await prisma.skill.findFirst({
      where: {
        name: { equals: name, mode: "insensitive" },
      },
    });

    if (existing) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "SKILL_ALREADY_EXISTS",
            message: "A skill with this name already exists",
          },
        },
        { status: 409 },
      );
    }

    // 🟢 Upload image
    const uploadedUrl = await uploadToCloudinary(photo, "skills");

    const newSkill = await prisma.skill.create({
      data: {
        name,
        photo: uploadedUrl,
        level: level ?? undefined, // ✅ pakai default DB kalau kosong
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Skill created successfully",
        data: newSkill,
      },
      { status: 201 },
    );
  }),
);
