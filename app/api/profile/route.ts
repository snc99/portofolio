import { NextResponse } from "next/server";
import { prisma } from "@/infrastructure/database/prisma";
import {
  UpdateProfileSchema,
  CreateProfileSchema,
} from "@/shared/validation/profile";
import {
  deleteFromCloudinary,
  updateCloudinaryFile,
  uploadToCloudinary,
} from "@/infrastructure/storage/cloudinary";
import { ApiResponse } from "@/shared/response/api-response.util";
import { withAuth } from "@/shared/http/with-auth";
import { withErrorHandler } from "@/shared/http/with-error-handler";

export const GET = withErrorHandler(
  withAuth(async () => {
    try {
      const profile = await prisma.profile.findFirst({
        select: {
          id: true,
          motto: true,
          cvLink: true,
          cvFilename: true,
          photo: true,
        },
      });

      if (!profile) {
        return NextResponse.json(
          ApiResponse.success(null, "Profile is empty"),
          { status: 200 },
        );
      }

      return NextResponse.json(
        ApiResponse.success(profile, "Profile retrieved successfully"),
        { status: 200 },
      );
    } catch (error) {
      console.error("GET PROFILE ERROR:", error);

      return NextResponse.json(
        ApiResponse.error(
          "Failed to retrieve profile",
          "INTERNAL_SERVER_ERROR",
        ),
        { status: 500 },
      );
    }
  }),
);

export const POST = withErrorHandler(
  withAuth(async (req: Request) => {
    try {
      const existing = await prisma.profile.findFirst();

      // 🔴 Conflict - Profile already exists
      if (existing) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: "PROFILE_ALREADY_EXISTS",
              message: "Profile has already been created.",
            },
          },
          { status: 409 },
        );
      }

      const formData = await req.formData();

      const result = CreateProfileSchema.safeParse({
        motto: formData.get("motto"),
        cv: formData.get("cv"),
        photo: formData.get("photo"),
      });

      if (!result.success) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: "VALIDATION_ERROR",
              message: "Invalid input data.",
              fields: result.error.flatten().fieldErrors,
            },
          },
          { status: 400 },
        );
      }

      const { motto, cv, photo } = result.data;

      // 📄 Upload CV
      const cvUrl = await uploadToCloudinary(cv, "cv_files");

      // 🖼 Upload Photo (optional)
      let photoUrl: string | null = null;
      if (photo && photo.size > 0) {
        photoUrl = await uploadToCloudinary(photo, "profile_photos");
      }

      const profile = await prisma.profile.create({
        data: {
          motto,
          cvLink: cvUrl,
          cvFilename: cv.name,
          photo: photoUrl, // ✅ FIELD BARU
        },
      });

      return NextResponse.json(
        {
          success: true,
          message: "Profile created successfully.",
          data: profile,
        },
        { status: 201 },
      );
    } catch (error) {
      console.error("POST PROFILE ERROR:", error);

      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INTERNAL_SERVER_ERROR",
            message:
              "An unexpected server error occurred while creating the profile.",
          },
        },
        { status: 500 },
      );
    }
  }),
);

export const PUT = withErrorHandler(
  withAuth(async (req: Request) => {
    try {
      const existing = await prisma.profile.findFirst();

      // 🔴 Not Found
      if (!existing) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: "PROFILE_NOT_FOUND",
              message: "Profile has not been created yet.",
            },
          },
          { status: 404 },
        );
      }

      const formData = await req.formData();

      // Normalize files
      const rawCv = formData.get("cv");
      const cv = rawCv instanceof File && rawCv.size > 0 ? rawCv : undefined;

      const rawPhoto = formData.get("photo");
      const photo =
        rawPhoto instanceof File && rawPhoto.size > 0 ? rawPhoto : undefined;

      const mottoRaw = formData.get("motto");

      const result = UpdateProfileSchema.safeParse({
        motto: typeof mottoRaw === "string" ? mottoRaw : undefined,
        cv,
        photo, // ✅ field baru
      });

      // 🔴 Validation Error
      if (!result.success) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: "VALIDATION_ERROR",
              message: "Invalid input data.",
              fields: result.error.flatten().fieldErrors,
            },
          },
          { status: 400 },
        );
      }

      const { motto, cv: validatedCv, photo: validatedPhoto } = result.data;

      // Check changes
      const isMottoChanged =
        typeof motto === "string" && existing.motto.trim() !== motto.trim();

      const isCvChanged = !!validatedCv;
      const isPhotoChanged = !!validatedPhoto; // ✅ baru

      // 🔴 No Changes
      if (!isMottoChanged && !isCvChanged && !isPhotoChanged) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: "NO_CHANGES_DETECTED",
              message:
                "At least one change must be made to update the profile.",
            },
          },
          { status: 400 },
        );
      }

      let cvUrl = existing.cvLink;
      let cvFilename = existing.cvFilename;
      let photoUrl = existing.photo; // ✅ baru

      // Update CV if new provided
      if (validatedCv) {
        const uploadedUrl = await updateCloudinaryFile(
          existing.cvLink ?? "",
          validatedCv,
          "cv_files",
        );

        cvUrl = uploadedUrl;
        cvFilename = validatedCv.name;
      }

      // 🖼 Update Photo if new provided
      if (validatedPhoto) {
        photoUrl = await updateCloudinaryFile(
          existing.photo ?? "",
          validatedPhoto,
          "profile_photos",
        );
      }

      const updated = await prisma.profile.update({
        where: { id: existing.id },
        data: {
          motto: isMottoChanged ? motto : existing.motto,
          cvLink: cvUrl,
          cvFilename: cvFilename,
          photo: photoUrl, // ✅ field baru masuk DB
        },
      });

      // 🟢 Success
      return NextResponse.json(
        {
          success: true,
          message: "Profile updated successfully.",
          data: updated,
        },
        { status: 200 },
      );
    } catch (error) {
      console.error("PUT PROFILE ERROR:", error);

      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INTERNAL_SERVER_ERROR",
            message:
              "An unexpected server error occurred while updating the profile.",
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
      const existing = await prisma.profile.findFirst({
        select: {
          id: true,
          cvLink: true,
          photo: true, // ✅ ambil field baru
        },
      });

      // 🔴 Not Found
      if (!existing) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: "PROFILE_NOT_FOUND",
              message: "Profile not found.",
            },
          },
          { status: 404 },
        );
      }

      // 🔴 Delete CV from Cloudinary (if exists)
      if (existing.cvLink) {
        try {
          await deleteFromCloudinary(existing.cvLink);
        } catch (cloudErr) {
          console.error("Cloudinary CV delete failed:", cloudErr);

          return NextResponse.json(
            {
              success: false,
              error: {
                code: "CLOUDINARY_DELETE_FAILED",
                message: "Failed to delete the CV file from cloud storage.",
              },
            },
            { status: 500 },
          );
        }
      }

      // 🖼 Delete Photo from Cloudinary (if exists) ✅ NEW
      if (existing.photo) {
        try {
          await deleteFromCloudinary(existing.photo);
        } catch (cloudErr) {
          console.error("Cloudinary photo delete failed:", cloudErr);

          return NextResponse.json(
            {
              success: false,
              error: {
                code: "CLOUDINARY_DELETE_FAILED",
                message:
                  "Failed to delete the profile photo from cloud storage.",
              },
            },
            { status: 500 },
          );
        }
      }

      // 🔥 Delete record from database
      await prisma.profile.delete({
        where: { id: existing.id },
      });

      // 🟢 Success
      return NextResponse.json(
        {
          success: true,
          message: "Profile deleted successfully.",
          data: null,
        },
        { status: 200 },
      );
    } catch (error) {
      console.error("DELETE PROFILE ERROR:", error);

      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INTERNAL_SERVER_ERROR",
            message:
              "An unexpected server error occurred while deleting the profile.",
          },
        },
        { status: 500 },
      );
    }
  }),
);
