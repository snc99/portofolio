import { NextResponse } from "next/server";
import { prisma } from "@/infrastructure/database/prisma";
import { CreateSocialMediaSchema } from "@/shared/validation/sosmed";
import { uploadToCloudinary } from "@/infrastructure/storage/cloudinary";
import { withAuth } from "@/shared/http/with-auth";
import { socialMediaService } from "@/modules/social-media/social-media.service";
import { withErrorHandler } from "@/shared/http/with-error-handler";

export const GET = withErrorHandler(
  withAuth(async (req: Request) => {
    const { searchParams } = new URL(req.url);

    const page = Number(searchParams.get("page") ?? 1);
    const limit = Number(searchParams.get("limit") ?? 10);

    // 🔴 Basic validation for pagination
    if (isNaN(page) || page < 1 || isNaN(limit) || limit < 1) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_PAGINATION_PARAMS",
            message: "Page and limit must be positive numbers.",
          },
        },
        { status: 400 },
      );
    }

    const data = await socialMediaService.getPaginatedSocialMedia(page, limit);

    return NextResponse.json(
      {
        success: true,
        message: "Social media retrieved successfully.",
        data, // should contain items + meta
      },
      { status: 200 },
    );
  }),
);

export const POST = withErrorHandler(
  withAuth(async (req: Request) => {
    const formData = await req.formData();

    const validation = CreateSocialMediaSchema.safeParse({
      platform: formData.get("platform"),
      url: formData.get("url"),
      photo: formData.get("photo"),
    });

    // 🔴 Validation Error
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Invalid input data.",
            fields: validation.error.flatten().fieldErrors,
          },
        },
        { status: 400 },
      );
    }

    const { platform, url, photo } = validation.data;

    // 🔴 Duplicate check (case insensitive)
    const existing = await prisma.socialMedia.findFirst({
      where: {
        platform: { equals: platform, mode: "insensitive" },
      },
    });

    if (existing) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "SOCIAL_MEDIA_DUPLICATE_PLATFORM",
            message: "This platform has already been registered.",
          },
        },
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

    // 🟢 Success
    return NextResponse.json(
      {
        success: true,
        message: "Social media created successfully.",
        data: newSocialMedia,
      },
      { status: 201 },
    );
  }),
);
