import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { CreateProjectSchema } from "@/lib/validation/projects";
import { withAuth } from "@/lib/with-auth";
import { ApiResponse } from "@/lib/response/api-response";
import z from "zod";

export const GET = withAuth(async (req) => {
  try {
    const { searchParams } = new URL(req.url);

    const page = Number(searchParams.get("page") ?? 1);
    const limit = Number(searchParams.get("limit") ?? 10);

    const safePage = page < 1 ? 1 : page;
    const safeLimit = limit > 50 ? 50 : limit;

    const skip = (safePage - 1) * safeLimit;

    const [items, total] = await Promise.all([
      prisma.project.findMany({
        skip,
        take: safeLimit,
        orderBy: { createdAt: "desc" },
        include: {
          techStack: {
            include: {
              skill: true,
            },
          },
        },
      }),
      prisma.project.count(),
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
        "Project berhasil diambil",
      ),
      { status: 200 },
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      ApiResponse.error("Gagal mengambil project", 500),
      { status: 500 },
    );
  }
});

export const POST = withAuth(async (req: Request) => {
  try {
    const formData = await req.formData();

    const skillsRaw = formData.get("skills") as string | null;

    let skillsArray: string[] = [];

    if (skillsRaw) {
      try {
        const parsed = JSON.parse(skillsRaw);
        if (!Array.isArray(parsed)) throw new Error();
        skillsArray = parsed;
      } catch {
        return NextResponse.json(
          ApiResponse.error("Format skills tidak valid", 400),
          { status: 400 },
        );
      }
    }

    const validation = CreateProjectSchema.safeParse({
      title: formData.get("title"),
      description: formData.get("description"),
      link: formData.get("link"),
      projectImage: formData.get("projectImage"),
      skills: skillsArray,
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

    const { title, description, link, projectImage, skills } = validation.data;

    // 🔥 Validasi skill ID di DB
    const validSkills = await prisma.skill.findMany({
      where: { id: { in: skills } },
      select: { id: true },
    });

    if (validSkills.length !== skills.length) {
      return NextResponse.json(
        ApiResponse.error("Beberapa skill tidak valid", 400),
        { status: 400 },
      );
    }

    const imageUrl = projectImage
      ? await uploadToCloudinary(projectImage, "projects")
      : null;

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
            skill: true,
          },
        },
      },
    });

    return NextResponse.json(
      ApiResponse.success(newProject, "Project berhasil disimpan", 201),
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating project:", error);

    return NextResponse.json(
      ApiResponse.error("Gagal menyimpan project", 500),
      { status: 500 },
    );
  }
});
