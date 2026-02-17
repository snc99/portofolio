import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { CreateProjectSchema } from "@/lib/validation/project";
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

    const title = formData.get("title")?.toString();
    const description = formData.get("description")?.toString() ?? "";
    const link = formData.get("link")?.toString() ?? "";
    const projectImageFile = formData.get("projectImage") as File | null;
    const skillsRaw = formData.get("skills") as string | null;

    // Parse skills
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
      title,
      description,
      link,
      projectImage: projectImageFile,
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

    // 🔥 Cek apakah semua skill ID valid
    if (skillsArray.length > 0) {
      const validSkills = await prisma.skill.findMany({
        where: { id: { in: skillsArray } },
        select: { id: true },
      });

      if (validSkills.length !== skillsArray.length) {
        return NextResponse.json(
          ApiResponse.error("Beberapa skill tidak valid", 400),
          { status: 400 },
        );
      }
    }

    const imageUrl = projectImageFile
      ? await uploadToCloudinary(projectImageFile, "projects")
      : null;

    const newProject = await prisma.project.create({
      data: {
        title: validation.data.title,
        description: validation.data.description,
        link: validation.data.link,
        projectImage: imageUrl,
        techStack: {
          create: validation.data.skills.map((skillId) => ({
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

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        ApiResponse.error(error.errors.map((e) => e.message).join(", "), 400),
        { status: 400 },
      );
    }

    return NextResponse.json(
      ApiResponse.error("Gagal menyimpan project", 500),
      { status: 500 },
    );
  }
});
