import { NextResponse } from "next/server";
import { prisma } from "@/infrastructure/database/prisma";
import { uploadToCloudinary } from "@/infrastructure/storage/cloudinary";
import { CreateProjectSchema } from "@/shared/validation/projects";
import { withAuth } from "@/shared/http/with-auth";
import { withErrorHandler } from "@/shared/http/with-error-handler";

export const GET = withErrorHandler(
  withAuth(async (req: Request) => {
    const { searchParams } = new URL(req.url);

    const page = Number(searchParams.get("page") ?? 1);
    const limit = Number(searchParams.get("limit") ?? 10);

    const safePage = Number.isNaN(page) || page < 1 ? 1 : page;

    const safeLimit =
      Number.isNaN(limit) || limit < 1 ? 10 : limit > 50 ? 50 : limit;

    const skip = (safePage - 1) * safeLimit;

    const [items, total] = await Promise.all([
      prisma.project.findMany({
        skip,
        take: safeLimit,
        orderBy: { createdAt: "desc" },
        include: {
          techStack: {
            include: {
              skill: {
                select: {
                  id: true,
                  name: true,
                  photo: true,
                  level: true, // ✅ enum ikut
                },
              },
            },
          },
        },
      }),
      prisma.project.count(),
    ]);

    // 🔥 Transform response
    const formattedItems = items.map((project) => ({
      id: project.id,
      title: project.title,
      description: project.description,
      link: project.link,
      projectImage: project.projectImage,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
      skills: project.techStack.map((t) => t.skill),
    }));

    return NextResponse.json(
      {
        success: true,
        message: "Projects retrieved successfully",
        data: {
          items: formattedItems,
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

    const skillIds = formData.getAll("skillIds") as string[];

    const validation = CreateProjectSchema.safeParse({
      title: formData.get("title"),
      description: formData.get("description"),
      link: formData.get("link"),
      projectImage: formData.get("projectImage"),
      skillIds,
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
      projectImage,
      skillIds: skills,
    } = validation.data;

    // 🔥 Validate skill IDs exist
    const validSkills = await prisma.skill.findMany({
      where: { id: { in: skills } },
      select: { id: true },
    });

    if (validSkills.length !== skills.length) {
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

    // 🖼 Upload image (optional)
    let imageUrl: string | null = null;
    if (projectImage && projectImage.size > 0) {
      imageUrl = await uploadToCloudinary(projectImage, "projects");
    }

    const newProject = await prisma.project.create({
      data: {
        title,
        description,
        link,
        projectImage: imageUrl,
        techStack: {
          create: skills.map((skillId) => ({
            skill: { connect: { id: skillId } },
          })),
        },
      },
      include: {
        techStack: {
          include: {
            skill: {
              select: {
                id: true,
                name: true,
                photo: true,
                level: true,
              },
            },
          },
        },
      },
    });

    // 🔥 Samakan format dengan GET
    const formattedProject = {
      id: newProject.id,
      title: newProject.title,
      description: newProject.description,
      link: newProject.link,
      projectImage: newProject.projectImage,
      createdAt: newProject.createdAt,
      updatedAt: newProject.updatedAt,
      skills: newProject.techStack.map((t) => t.skill),
    };

    return NextResponse.json(
      {
        success: true,
        message: "Project created successfully",
        data: formattedProject,
      },
      { status: 201 },
    );
  }),
);
