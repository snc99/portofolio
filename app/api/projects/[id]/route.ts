import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { deleteFromCloudinary, uploadToCloudinary } from "@/lib/cloudinary";
import { CreateProjectSchema } from "@/lib/validation/project";
import { ApiResponse } from "@/lib/response/api-response";
import z from "zod";
import { withAuth } from "@/lib/with-auth";

export const PUT = withAuth(async (req, { params }) => {
  try {
    const { id } = await params!;

    if (!id) {
      return NextResponse.json(ApiResponse.error("ID tidak valid", 400), {
        status: 400,
      });
    }

    const project = await prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      return NextResponse.json(
        ApiResponse.error("Proyek tidak ditemukan", 404),
        { status: 404 },
      );
    }

    const formData = await req.formData();

    const title = formData.get("title")?.toString();
    const description = formData.get("description")?.toString() ?? "";
    const link = formData.get("link")?.toString() ?? "";
    const projectImageFile = formData.get("projectImage") as File | null;
    const skillsRaw = formData.get("skills") as string;

    let skills: string[] = [];

    try {
      const parsed = JSON.parse(skillsRaw);
      if (!Array.isArray(parsed)) throw new Error();
      skills = parsed;
    } catch {
      return NextResponse.json(
        ApiResponse.error("Format skills tidak valid", 400),
        { status: 400 },
      );
    }

    const validation = CreateProjectSchema.safeParse({
      title,
      description,
      link,
      projectImage: projectImageFile ?? null,
      skills,
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

    // 🔥 Validasi skill ID
    if (skills.length > 0) {
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
    }

    let imageUrl = project.projectImage;

    // 🔥 Upload new image kalau ada
    if (projectImageFile) {
      const uploadedUrl = await uploadToCloudinary(
        projectImageFile,
        "projects",
      );

      // delete image lama
      if (project.projectImage) {
        await deleteFromCloudinary(project.projectImage);
      }

      imageUrl = uploadedUrl;
    }

    const updatedProject = await prisma.project.update({
      where: { id },
      data: {
        title,
        description,
        link,
        projectImage: imageUrl,
        techStack: {
          deleteMany: {}, // sync relation
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
      ApiResponse.success(updatedProject, "Project berhasil diperbarui"),
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating project:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        ApiResponse.error(error.errors.map((e) => e.message).join(", "), 400),
        { status: 400 },
      );
    }

    return NextResponse.json(
      ApiResponse.error("Gagal memperbarui project", 500),
      { status: 500 },
    );
  }
});

export const DELETE = withAuth(async (req, { params }) => {
  try {
    const { id } = await params!;

    if (!id || id.trim() === "") {
      return NextResponse.json(ApiResponse.error("ID tidak valid", 400), {
        status: 400,
      });
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
        ApiResponse.error("Project tidak ditemukan", 404),
        { status: 404 },
      );
    }

    await prisma.project.delete({
      where: { id },
    });

    if (project.projectImage) {
      try {
        await deleteFromCloudinary(project.projectImage);
      } catch (cloudinaryError) {
        console.error("Cloudinary delete error:", cloudinaryError);
      }
    }

    return NextResponse.json(
      ApiResponse.success(
        {
          id: project.id,
          title: project.title,
        },
        "Project berhasil dihapus",
      ),
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting project:", error);

    return NextResponse.json(
      ApiResponse.error("Terjadi kesalahan saat menghapus project", 500),
      { status: 500 },
    );
  }
});
