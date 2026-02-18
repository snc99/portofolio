import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { deleteFromCloudinary, uploadToCloudinary } from "@/lib/cloudinary";
import { ApiResponse } from "@/lib/response/api-response";
import { withAuth } from "@/lib/with-auth";
import { UpdateProjectSchema } from "@/lib/validation/projects";

export const PATCH = withAuth(async (req, { params }) => {
  try {
    const { id } = await params!;

    if (!id) {
      return NextResponse.json(ApiResponse.error("ID tidak valid", 400), {
        status: 400,
      });
    }

    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        techStack: { select: { skillId: true } },
      },
    });

    if (!project) {
      return NextResponse.json(
        ApiResponse.error("Proyek tidak ditemukan", 404),
        { status: 404 },
      );
    }

    const formData = await req.formData();

    const skillsRaw = formData.get("skills") as string | null;

    let parsedSkills: string[] | undefined;

    if (skillsRaw) {
      try {
        const parsed = JSON.parse(skillsRaw);
        if (!Array.isArray(parsed)) throw new Error();
        parsedSkills = parsed;
      } catch {
        return NextResponse.json(
          ApiResponse.error("Format skills tidak valid", 400),
          { status: 400 },
        );
      }
    }

    const validation = UpdateProjectSchema.safeParse({
      title: formData.get("title"),
      description: formData.get("description"),
      link: formData.get("link"),
      projectImage: formData.get("projectImage"),
      skills: parsedSkills,
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

    // 🔥 Merge dengan existing
    const finalTitle = title ?? project.title;
    const finalDescription = description ?? project.description;
    const finalLink = link ?? project.link;
    const finalSkills = skills ?? project.techStack.map((s) => s.skillId);

    // 🔥 Validasi skill ID kalau berubah
    if (skills) {
      const validSkills = await prisma.skill.findMany({
        where: { id: { in: finalSkills } },
        select: { id: true },
      });

      if (validSkills.length !== finalSkills.length) {
        return NextResponse.json(
          ApiResponse.error("Beberapa skill tidak valid", 400),
          { status: 400 },
        );
      }
    }

    // 🔥 DETEKSI PERUBAHAN
    const oldSkillIds = project.techStack.map((s) => s.skillId).sort();

    const newSkillIds = [...finalSkills].sort();

    const isTitleChanged = finalTitle !== project.title;
    const isDescriptionChanged = finalDescription !== project.description;
    const isLinkChanged = finalLink !== project.link;
    const isImageChanged = !!projectImage;
    const isSkillsChanged =
      JSON.stringify(oldSkillIds) !== JSON.stringify(newSkillIds);

    if (
      !isTitleChanged &&
      !isDescriptionChanged &&
      !isLinkChanged &&
      !isImageChanged &&
      !isSkillsChanged
    ) {
      return NextResponse.json(
        ApiResponse.error("Minimal satu perubahan harus dilakukan", 400),
        { status: 400 },
      );
    }

    let imageUrl = project.projectImage;

    if (projectImage) {
      const uploadedUrl = await uploadToCloudinary(projectImage, "projects");

      if (project.projectImage) {
        await deleteFromCloudinary(project.projectImage);
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
        techStack: { include: { skill: true } },
      },
    });

    return NextResponse.json(
      ApiResponse.success(updatedProject, "Project berhasil diperbarui"),
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating project:", error);

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
