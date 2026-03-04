import { prisma } from "@/infrastructure/database/prisma";
import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from "@/infrastructure/storage/cloudinary";
import { NextResponse } from "next/server";
import { UpdateSkillSchema } from "@/shared/validation/skillSchema";
import { withAuth } from "@/shared/http/with-auth";
import { withErrorHandler } from "@/shared/http/with-error-handler";

export const PATCH = withErrorHandler(
  withAuth(async (req: Request, context) => {
    const resolvedParams = await context.params;
    const id = resolvedParams?.id;

    if (!id || id.trim() === "") {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_ID",
            message: "Invalid skill ID",
          },
        },
        { status: 400 },
      );
    }

    const existing = await prisma.skill.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "SKILL_NOT_FOUND",
            message: "Skill not found",
          },
        },
        { status: 404 },
      );
    }

    const formData = await req.formData();

    const validation = UpdateSkillSchema.safeParse({
      name: formData.get("name"),
      photo: formData.get("photo"),
    });

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

    const { name, photo } = validation.data;

    const isNameChanged =
      typeof name === "string" && name.trim() !== existing.name;

    const isPhotoChanged = photo instanceof File && photo.size > 0;

    if (!isNameChanged && !isPhotoChanged) {
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

    const updateData: {
      name?: string;
      photo?: string;
    } = {};

    // 🔥 Duplicate check if name changed
    if (isNameChanged) {
      const duplicate = await prisma.skill.findFirst({
        where: {
          name: { equals: name, mode: "insensitive" },
          NOT: { id },
        },
      });

      if (duplicate) {
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

      updateData.name = name!.trim();
    }

    // 🔥 Photo update
    if (isPhotoChanged) {
      const uploadedUrl = await uploadToCloudinary(photo!, "skills");

      if (existing.photo) {
        try {
          await deleteFromCloudinary(existing.photo);
        } catch (err) {
          console.error("Cloudinary delete error:", err);
        }
      }

      updateData.photo = uploadedUrl;
    }

    const updatedSkill = await prisma.skill.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Skill updated successfully",
        data: updatedSkill,
      },
      { status: 200 },
    );
  }),
);

export const DELETE = withErrorHandler(
  withAuth(async (req: Request, context) => {
    const resolvedParams = await context.params;
    const id = resolvedParams?.id;

    if (!id || id.trim() === "") {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_ID",
            message: "Invalid skill ID",
          },
        },
        { status: 400 },
      );
    }

    const skill = await prisma.skill.findUnique({
      where: { id },
      include: {
        projects: true,
      },
    });

    if (!skill) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "SKILL_NOT_FOUND",
            message: "Skill not found",
          },
        },
        { status: 404 },
      );
    }

    // 🔴 Prevent delete if still used in projects
    if (skill.projects.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "SKILL_IN_USE",
            message:
              "Skill cannot be deleted because it is still used in projects",
          },
        },
        { status: 409 },
      );
    }

    await prisma.skill.delete({
      where: { id },
    });

    // 🔥 Cloudinary cleanup (non-blocking failure)
    if (skill.photo) {
      try {
        await deleteFromCloudinary(skill.photo);
      } catch (cloudinaryError) {
        console.error("Cloudinary delete error:", cloudinaryError);
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: "Skill deleted successfully",
        data: {
          id: skill.id,
          name: skill.name,
        },
      },
      { status: 200 },
    );
  }),
);
