import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { CreateSkillSchema } from "@/lib/validation/skillSchema";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { withAuth } from "@/lib/with-auth";
import { ApiResponse } from "@/lib/response/api-response";

export const GET = withAuth(async (req: Request) => {
  try {
    const { searchParams } = new URL(req.url);

    const page = Number(searchParams.get("page") ?? 1);
    const limit = Number(searchParams.get("limit") ?? 10);

    const safePage = page < 1 ? 1 : page;
    const safeLimit = limit > 50 ? 50 : limit;

    const skip = (safePage - 1) * safeLimit;

    const [items, total] = await Promise.all([
      prisma.skill.findMany({
        skip,
        take: safeLimit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.skill.count(),
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
        "Skill berhasil diambil",
      ),
      { status: 200 },
    );
  } catch (error) {
    console.error("❌ Error fetching skills:", error);

    return NextResponse.json(ApiResponse.error("Gagal mengambil skill", 500), {
      status: 500,
    });
  }
});

export const POST = withAuth(async (req: Request) => {
  try {
    const formData = await req.formData();

    const validation = CreateSkillSchema.safeParse({
      name: formData.get("name"),
      photo: formData.get("photo"),
    });

    if (!validation.success) {
      return NextResponse.json(
        ApiResponse.error(
          validation.error.errors.map((e) => e.message).join(", "),
          400,
        ),
        { status: 400 },
      );
    }

    const { name, photo } = validation.data;

    // 🔥 Cegah duplicate skill name
    const existing = await prisma.skill.findFirst({
      where: { name: { equals: name, mode: "insensitive" } },
    });

    if (existing) {
      return NextResponse.json(
        ApiResponse.error("Skill dengan nama tersebut sudah ada", 409),
        { status: 409 },
      );
    }

    const uploadedUrl = await uploadToCloudinary(photo, "skills");

    const newSkill = await prisma.skill.create({
      data: {
        name,
        photo: uploadedUrl,
      },
    });

    return NextResponse.json(
      ApiResponse.success(newSkill, "Skill berhasil dibuat", 201),
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating skill:", error);

    return NextResponse.json(ApiResponse.error("Gagal membuat skill", 500), {
      status: 500,
    });
  }
});
