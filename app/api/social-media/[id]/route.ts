import { NextResponse } from "next/server";
import { prisma } from "@/infrastructure/database/prisma";
import { UpdateSocialMediaSchema } from "@/shared/validation/sosmed";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "@/infrastructure/storage/cloudinary";
import { withAuth } from "@/shared/http/with-auth";
import { withErrorHandler } from "@/shared/http/with-error-handler";

export const PATCH = withErrorHandler(
  withAuth(
    async (req: Request, context: { params: Promise<{ id: string }> }) => {
      const { id } = await context.params;

      // 🔴 Invalid ID
      if (!id || id.trim() === "") {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: "INVALID_ID",
              message: "ID not valid",
            },
          },
          { status: 400 },
        );
      }

      const existing = await prisma.socialMedia.findUnique({
        where: { id },
      });

      // 🔴 Not found
      if (!existing) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: "SOCIAL_NOT_FOUND",
              message: "Social media not found",
            },
          },
          { status: 404 },
        );
      }

      const formData = await req.formData();

      const platform = formData.get("platform")?.toString().trim() || undefined;

      const url = formData.get("url")?.toString().trim() || undefined;

      const rawPhoto = formData.get("photo");
      const photoFile =
        rawPhoto instanceof File && rawPhoto.size > 0 ? rawPhoto : undefined;

      const validation = UpdateSocialMediaSchema.safeParse({
        platform,
        url,
        photo: photoFile,
      });

      // 🔴 Validation error
      if (!validation.success) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: "VALIDATION_ERROR",
              message: "Data is not valid",
              fields: validation.error.flatten().fieldErrors,
            },
          },
          { status: 400 },
        );
      }

      const isPlatformChanged =
        typeof platform === "string" && platform !== existing.platform;

      const isUrlChanged = typeof url === "string" && url !== existing.url;

      const isPhotoChanged = !!photoFile;

      // 🔴 No changes
      if (!isPlatformChanged && !isUrlChanged && !isPhotoChanged) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: "NO_CHANGES",
              message: "No changes detected",
            },
          },
          { status: 400 },
        );
      }

      const updateData: {
        platform?: string;
        url?: string;
        photo?: string;
      } = {};

      // 🔴 Duplicate platform
      if (isPlatformChanged) {
        const duplicate = await prisma.socialMedia.findFirst({
          where: {
            platform: { equals: platform, mode: "insensitive" },
            NOT: { id },
          },
        });

        if (duplicate) {
          return NextResponse.json(
            {
              success: false,
              error: {
                code: "SOCIAL_DUPLICATE_PLATFORM",
                message: "Platform already used",
              },
            },
            { status: 409 },
          );
        }

        updateData.platform = platform!;
      }

      if (isUrlChanged) {
        updateData.url = url!;
      }

      if (isPhotoChanged && photoFile) {
        const uploadedUrl = await uploadToCloudinary(photoFile, "social-media");

        if (existing.photo) {
          try {
            await deleteFromCloudinary(existing.photo);
          } catch (err) {
            console.error("Cloudinary delete error:", err);
          }
        }

        updateData.photo = uploadedUrl;
      }

      const updated = await prisma.socialMedia.update({
        where: { id },
        data: updateData,
      });

      // 🟢 Success
      return NextResponse.json(
        {
          success: true,
          message: "Social media updated successfully",
          data: updated,
        },
        { status: 200 },
      );
    },
  ),
);

export const DELETE = withErrorHandler(
  withAuth(
    async (req: Request, context: { params: Promise<{ id: string }> }) => {
      const { id } = await context.params;

      // 🔴 Invalid ID
      if (!id || id.trim() === "") {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: "INVALID_ID",
              message: "Invalid social media ID",
            },
          },
          { status: 400 },
        );
      }

      const existing = await prisma.socialMedia.findUnique({
        where: { id },
        select: {
          id: true,
          platform: true,
          photo: true,
        },
      });

      // 🔴 Not found
      if (!existing) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: "SOCIAL_NOT_FOUND",
              message: "Social media account not found",
            },
          },
          { status: 404 },
        );
      }

      // 🔥 Delete from database first
      await prisma.socialMedia.delete({
        where: { id },
      });

      // 🔥 Cleanup Cloudinary (non-blocking)
      if (existing.photo) {
        try {
          await deleteFromCloudinary(existing.photo);
        } catch (err) {
          console.error("Cloudinary delete error:", err);
        }
      }

      // 🟢 Success
      return NextResponse.json(
        {
          success: true,
          message: "Social media account deleted successfully",
          data: {
            id: existing.id,
            platform: existing.platform,
          },
        },
        { status: 200 },
      );
    },
  ),
);
