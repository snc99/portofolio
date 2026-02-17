import { NextResponse, NextRequest } from "next/server";
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

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const name = formData.get("name")?.toString().trim();
    const photoFile = formData.get("photo");

    if (!name || !photoFile || !(photoFile instanceof File)) {
      return NextResponse.json(
        { error: "Name and a valid photo are required" },
        { status: 400 },
      );
    }

    const validation = CreateSkillSchema.safeParse({ name, photo: photoFile });
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    let uploadedUrl;
    try {
      uploadedUrl = await uploadToCloudinary(photoFile, "skills");
    } catch (uploadError) {
      console.error("Cloudinary Upload Error:", uploadError);
      return NextResponse.json(
        { error: "Failed to upload photo" },
        { status: 500 },
      );
    }

    const newSkill = await prisma.skill.create({
      data: {
        name,
        photo: uploadedUrl,
      },
    });

    return NextResponse.json(newSkill, { status: 201 });
  } catch (error) {
    console.error("Internal Server Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
