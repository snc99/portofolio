import { prisma } from "@/lib/prisma";
import { deleteFromCloudinary, uploadToCloudinary } from "@/lib/cloudinary";
import { NextRequest, NextResponse } from "next/server";
import { UpdateSkillSchema } from "@/lib/validation/skillSchema";
import { withAuth } from "@/lib/with-auth";
import { ApiResponse } from "@/lib/response/api-response";
import z from "zod";

export const PUT = withAuth(async (req, { params }) => {
  try {
    const { id } = await params!;

    if (!id || id.trim() === "") {
      return NextResponse.json(ApiResponse.error("ID tidak valid", 400), {
        status: 400,
      });
    }

    const existing = await prisma.skill.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        ApiResponse.error("Skill tidak ditemukan", 404),
        { status: 404 },
      );
    }

    const formData = await req.formData();
    const name = formData.get("name")?.toString().trim();
    const photoFile = formData.get("photo");

    const validation = await UpdateSkillSchema.safeParseAsync({
      name,
      photo: photoFile,
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

    const updateData: {
      name?: string;
      photo?: string;
    } = {};

    if (name && name !== existing.name) {
      updateData.name = name;
    }

    if (photoFile && photoFile instanceof File) {
      const uploadedUrl = await uploadToCloudinary(photoFile, "skills");
      updateData.photo = uploadedUrl;
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        ApiResponse.success(existing, "Tidak ada perubahan"),
        { status: 200 },
      );
    }

    const updatedSkill = await prisma.skill.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(
      ApiResponse.success(updatedSkill, "Skill berhasil diperbarui"),
      { status: 200 },
    );
  } catch (error) {
    console.error("❌ Error updating skill:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        ApiResponse.error(
          error.errors.map((err) => err.message).join(", "),
          400,
        ),
        { status: 400 },
      );
    }

    return NextResponse.json(ApiResponse.error("Gagal mengupdate skill", 500), {
      status: 500,
    });
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

    const skill = await prisma.skill.findUnique({
      where: { id },
      include: {
        projects: true,
      },
    });

    if (!skill) {
      return NextResponse.json(
        ApiResponse.error("Skill tidak ditemukan", 404),
        { status: 404 },
      );
    }

    //  Cegah delete kalau masih dipakai project
    if (skill.projects.length > 0) {
      return NextResponse.json(
        ApiResponse.error(
          "Skill tidak bisa dihapus karena masih digunakan oleh project",
          409,
        ),
        { status: 409 },
      );
    }

    await prisma.skill.delete({
      where: { id },
    });

    // hapus image cloudinary (optional cleanup)
    if (skill.photo) {
      try {
        await deleteFromCloudinary(skill.photo);
      } catch (cloudinaryError) {
        console.error("Cloudinary delete error:", cloudinaryError);
      }
    }

    return NextResponse.json(
      ApiResponse.success(
        { id: skill.id, name: skill.name },
        "Skill berhasil dihapus",
      ),
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting skill:", error);

    return NextResponse.json(
      ApiResponse.error("Terjadi kesalahan saat menghapus skill", 500),
      { status: 500 },
    );
  }
});
