import { NextResponse } from "next/server";
import { prisma } from "@/infrastructure/database/prisma";
import {
  CreateAboutSchema,
  UpdateAboutSchema,
} from "@/modules/about/about.schema";
import { withAuth } from "@/shared/http/with-auth";
import { withErrorHandler } from "@/shared/http/with-error-handler";
import {
  deleteFromCloudinary,
  updateCloudinaryFile,
  uploadToCloudinary,
} from "@/infrastructure/storage/cloudinary";

export const GET = withErrorHandler(
  withAuth(async () => {
    const about = await prisma.about.findFirst({
      select: {
        id: true,
        description: true,
        photo: true, // ✅ field baru
      },
    });

    if (!about) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "ABOUT_NOT_FOUND",
            message: "About data not found",
          },
        },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "About data retrieved successfully",
        data: about,
      },
      { status: 200 },
    );
  }),
);

export const POST = withErrorHandler(
  withAuth(async (req: Request) => {
    const existing = await prisma.about.findFirst();

    if (existing) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "ABOUT_ALREADY_EXISTS",
            message: "About data already exists. Please use update instead.",
          },
        },
        { status: 400 },
      );
    }

    const formData = await req.formData();

    const result = CreateAboutSchema.safeParse({
      description: formData.get("description"),
      photo: formData.get("photo"),
    });

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Invalid input data",
            fields: result.error.flatten().fieldErrors,
          },
        },
        { status: 400 },
      );
    }

    const { description, photo } = result.data;

    let photoUrl: string | null = null;

    // 🖼 Upload photo (optional)
    if (photo && photo.size > 0) {
      photoUrl = await uploadToCloudinary(photo, "about_photos");
    }

    const about = await prisma.about.create({
      data: {
        description,
        photo: photoUrl, // ✅ field baru
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "About created successfully",
        data: about,
      },
      { status: 201 },
    );
  }),
);

export const PUT = withErrorHandler(
  withAuth(async (req: Request) => {
    try {
      const existing = await prisma.about.findFirst();

      const formData = await req.formData();

      // Normalize photo
      const rawPhoto = formData.get("photo");
      const photo =
        rawPhoto instanceof File && rawPhoto.size > 0 ? rawPhoto : undefined;

      const descriptionRaw = formData.get("description");

      const parsed = UpdateAboutSchema.safeParse({
        description:
          typeof descriptionRaw === "string" ? descriptionRaw : undefined,
        photo,
      });

      // 🔴 Validation error
      if (!parsed.success) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: "VALIDATION_ERROR",
              message: "Invalid input data",
              fields: parsed.error.flatten().fieldErrors,
            },
          },
          { status: 400 },
        );
      }

      const { description, photo: validatedPhoto } = parsed.data;
      const trimmedDescription = description?.trim();

      // 🟡 CASE 1 — Data belum ada → CREATE
      if (!existing) {
        if (!trimmedDescription) {
          return NextResponse.json(
            {
              success: false,
              error: {
                code: "DESCRIPTION_REQUIRED",
                message: "Description is required to create About data",
              },
            },
            { status: 400 },
          );
        }

        let photoUrl: string | null = null;

        if (validatedPhoto) {
          photoUrl = await uploadToCloudinary(validatedPhoto, "about_photos");
        }

        const created = await prisma.about.create({
          data: {
            description: trimmedDescription,
            photo: photoUrl,
          },
        });

        return NextResponse.json(
          {
            success: true,
            message: "About created successfully",
            data: created,
          },
          { status: 201 },
        );
      }

      // Detect changes
      const isDescriptionChanged =
        typeof trimmedDescription === "string" &&
        trimmedDescription !== existing.description;

      const isPhotoChanged = !!validatedPhoto;

      // 🔴 No changes
      if (!isDescriptionChanged && !isPhotoChanged) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: "NO_CHANGES",
              message: "At least one change must be made",
            },
          },
          { status: 400 },
        );
      }

      let photoUrl = existing.photo;

      // 🖼 Update photo if new provided
      if (validatedPhoto) {
        photoUrl = await updateCloudinaryFile(
          existing.photo ?? "",
          validatedPhoto,
          "about_photos",
        );
      }

      // 🟢 Update
      const updated = await prisma.about.update({
        where: { id: existing.id },
        data: {
          description: isDescriptionChanged
            ? trimmedDescription
            : existing.description,
          photo: photoUrl,
        },
      });

      return NextResponse.json(
        {
          success: true,
          message: "About updated successfully",
          data: updated,
        },
        { status: 200 },
      );
    } catch (error) {
      console.error("PUT ABOUT ERROR:", error);

      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to update About data",
          },
        },
        { status: 500 },
      );
    }
  }),
);

export const DELETE = withErrorHandler(
  withAuth(async () => {
    try {
      const existing = await prisma.about.findFirst({
        select: {
          id: true,
          photo: true, // ✅ ambil foto
        },
      });

      // 🔴 Not found
      if (!existing) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: "ABOUT_NOT_FOUND",
              message: "About data not found",
            },
          },
          { status: 404 },
        );
      }

      // 🖼 Delete photo from Cloudinary (if exists)
      if (existing.photo) {
        try {
          await deleteFromCloudinary(existing.photo);
        } catch (cloudErr) {
          console.error("Cloudinary delete failed:", cloudErr);

          return NextResponse.json(
            {
              success: false,
              error: {
                code: "CLOUDINARY_DELETE_FAILED",
                message: "Failed to delete photo from cloud storage",
              },
            },
            { status: 500 },
          );
        }
      }

      // 🔥 Delete DB record
      await prisma.about.delete({
        where: { id: existing.id },
      });

      // 🟢 Success
      return NextResponse.json(
        {
          success: true,
          message: "About deleted successfully",
          data: null,
        },
        { status: 200 },
      );
    } catch (error) {
      console.error("DELETE ABOUT ERROR:", error);

      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to delete About data",
          },
        },
        { status: 500 },
      );
    }
  }),
);
