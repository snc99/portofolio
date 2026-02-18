import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { CreateSocialMediaSchema } from "@/lib/validation/sosmed";
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
      prisma.socialMedia.findMany({
        skip,
        take: safeLimit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.socialMedia.count(),
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
        "Social media berhasil diambil",
      ),
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching social media:", error);

    return NextResponse.json(
      ApiResponse.error("Gagal mengambil social media", 500),
      { status: 500 },
    );
  }
});

export const POST = withAuth(async (req: Request) => {
  try {
    const formData = await req.formData();

    const validation = CreateSocialMediaSchema.safeParse({
      platform: formData.get("platform"),
      url: formData.get("url"),
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

    const { platform, url, photo } = validation.data;

    // 🔥 Cegah duplicate platform (case insensitive)
    const existing = await prisma.socialMedia.findFirst({
      where: {
        platform: { equals: platform, mode: "insensitive" },
      },
    });

    if (existing) {
      return NextResponse.json(
        ApiResponse.error("Platform sudah terdaftar", 409),
        { status: 409 },
      );
    }

    const uploadedUrl = await uploadToCloudinary(photo, "social-media");

    const newSocialMedia = await prisma.socialMedia.create({
      data: {
        platform,
        url,
        photo: uploadedUrl,
      },
    });

    return NextResponse.json(
      ApiResponse.success(
        newSocialMedia,
        "Social media berhasil ditambahkan",
        201,
      ),
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating social media:", error);

    return NextResponse.json(
      ApiResponse.error("Terjadi kesalahan saat menambahkan social media", 500),
      { status: 500 },
    );
  }
});
