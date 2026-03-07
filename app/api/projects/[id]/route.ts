import { NextResponse } from "next/server";
import { prisma } from "@/infrastructure/database/prisma";
import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from "@/infrastructure/storage/cloudinary";
import { withAuth } from "@/shared/http/with-auth";
import { UpdateProjectSchema } from "@/shared/validation/projects";
import { withErrorHandler } from "@/shared/http/with-error-handler";

export const PATCH = withErrorHandler(
  withAuth(async (req: Request, context) => {
    const resolvedParams = await context.params;
    const id = resolvedParams?.id;

    if (!id || id.trim() === "") {
      return NextResponse.json(
        {
          success: false,
          error: { code: "INVALID_ID", message: "Invalid project ID" },
        },
        { status: 400 },
      );
    }

    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        techStack: { select: { skillId: true } },
      },
    });

    if (!project) {
      return NextResponse.json(
        {
          success: false,
          error: { code: "PROJECT_NOT_FOUND", message: "Project not found" },
        },
        { status: 404 },
      );
    }

    const formData = await req.formData();

    const rawImage = formData.get("projectImage");
    const projectImage =
      rawImage instanceof File && rawImage.size > 0 ? rawImage : undefined;

    const skillIds = formData.getAll("skillIds") as string[];
    const parsedSkills = skillIds.length > 0 ? skillIds : undefined;

    const validation = UpdateProjectSchema.safeParse({
      title: formData.get("title"),
      description: formData.get("description"),
      link: formData.get("link"),
      projectImage,
      skillIds: parsedSkills,
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

    const {
      title,
      description,
      link,
      projectImage: validatedImage,
      skillIds: skills,
    } = validation.data;

    const finalTitle = title ?? project.title;
    const finalDescription = description ?? project.description;
    const finalLink = link ?? project.link;
    const finalSkills = skills ?? project.techStack.map((s) => s.skillId);

    if (skills) {
      const validSkills = await prisma.skill.findMany({
        where: { id: { in: finalSkills } },
        select: { id: true },
      });

      if (validSkills.length !== finalSkills.length) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: "INVALID_SKILL_REFERENCE",
              message: "One or more skills are invalid",
            },
          },
          { status: 400 },
        );
      }
    }

    const oldSkillIds = project.techStack.map((s) => s.skillId).sort();
    const newSkillIds = [...finalSkills].sort();

    const isSkillsChanged =
      oldSkillIds.length !== newSkillIds.length ||
      oldSkillIds.some((id, i) => id !== newSkillIds[i]);

    const isImageChanged = !!validatedImage;

    const isChanged =
      finalTitle !== project.title ||
      finalDescription !== project.description ||
      finalLink !== project.link ||
      isImageChanged ||
      isSkillsChanged;

    if (!isChanged) {
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

    let imageUrl = project.projectImage;

    if (isImageChanged) {
      const uploadedUrl = await uploadToCloudinary(validatedImage!, "projects");

      if (project.projectImage) {
        try {
          await deleteFromCloudinary(project.projectImage);
        } catch (err) {
          console.error("Cloudinary delete error:", err);
        }
      }

      imageUrl = uploadedUrl;
    }

    const updatedProject = await prisma.project.update({
      where: { id },
      data: {
        title: finalTitle,
        description: finalDescription,
        link: finalLink,
        projectImage: imageUrl,
        techStack: isSkillsChanged
          ? {
              deleteMany: {},
              create: finalSkills.map((skillId) => ({
                skill: { connect: { id: skillId } },
              })),
            }
          : undefined,
      },
      include: {
        techStack: {
          include: {
            skill: {
              select: { id: true, name: true, photo: true, level: true },
            },
          },
        },
      },
    });

    const formattedProject = {
      id: updatedProject.id,
      title: updatedProject.title,
      description: updatedProject.description,
      link: updatedProject.link,
      projectImage: updatedProject.projectImage,
      createdAt: updatedProject.createdAt,
      updatedAt: updatedProject.updatedAt,
      skills: updatedProject.techStack.map((t) => t.skill),
    };

    return NextResponse.json(
      {
        success: true,
        message: "Project updated successfully",
        data: formattedProject,
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
            message: "Invalid project ID",
          },
        },
        { status: 400 },
      );
    }

    const project = await prisma.project.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        projectImage: true,
      },
    });

    if (!project) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "PROJECT_NOT_FOUND",
            message: "Project not found",
          },
        },
        { status: 404 },
      );
    }

    // 🔥 Delete project first (relation cascade otomatis)
    await prisma.project.delete({
      where: { id },
    });

    // 🖼 Cloudinary cleanup (best effort)
    if (project.projectImage) {
      try {
        await deleteFromCloudinary(project.projectImage);
      } catch (cloudinaryError) {
        console.error("Cloudinary delete error:", cloudinaryError);
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: "Project deleted successfully",
        data: {
          id: project.id,
          title: project.title,
        },
      },
      { status: 200 },
    );
  }),
);
