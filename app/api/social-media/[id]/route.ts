import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { UpdateSocialMediaSchema } from "@/lib/validation/sosmed";
import { uploadToCloudinary, deleteFromCloudinary } from "@/lib/cloudinary";
import { ApiResponse } from "@/lib/response/api-response";
import z from "zod";
import { withAuth } from "@/lib/with-auth";

export const PATCH = withAuth(async (req, { params }) => {
  try {
    const { id } = await params!;

    if (!id || id.trim() === "") {
      return NextResponse.json(ApiResponse.error("ID tidak valid", 400), {
        status: 400,
      });
    }

    const existing = await prisma.socialMedia.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        ApiResponse.error("Social media tidak ditemukan", 404),
        { status: 404 },
      );
    }

    const formData = await req.formData();

    const platform = formData.get("platform")?.toString().trim() ?? null;
    const url = formData.get("url")?.toString().trim() ?? null;
    const photoFile = formData.get("photo");

    const validation = UpdateSocialMediaSchema.safeParse({
      platform,
      url,
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
      platform?: string;
      url?: string;
      photo?: string;
    } = {};

    // 🔥 Cegah duplicate platform
    if (platform && platform !== existing.platform) {
      const duplicate = await prisma.socialMedia.findFirst({
        where: { platform },
      });

      if (duplicate) {
        return NextResponse.json(
          ApiResponse.error("Platform sudah digunakan", 409),
          { status: 409 },
        );
      }

      updateData.platform = platform;
    }

    if (url && url !== existing.url) {
      updateData.url = url;
    }

    if (photoFile && photoFile instanceof File) {
      const uploadedUrl = await uploadToCloudinary(photoFile, "social-media");

      // hapus foto lama
      if (existing.photo) {
        try {
          await deleteFromCloudinary(existing.photo);
        } catch (err) {
          console.error("Cloudinary delete error:", err);
        }
      }

      updateData.photo = uploadedUrl;
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        ApiResponse.success(existing, "Tidak ada perubahan"),
        { status: 200 },
      );
    }

    const updated = await prisma.socialMedia.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(
      ApiResponse.success(updated, "Social media berhasil diperbarui"),
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating social media:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        ApiResponse.error(error.errors.map((e) => e.message).join(", "), 400),
        { status: 400 },
      );
    }

    return NextResponse.json(
      ApiResponse.error("Gagal memperbarui social media", 500),
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

    const existing = await prisma.socialMedia.findUnique({
      where: { id },
      select: {
        id: true,
        platform: true,
        photo: true,
      },
    });

    if (!existing) {
      return NextResponse.json(
        ApiResponse.error("Social media tidak ditemukan", 404),
        { status: 404 },
      );
    }

    // Hapus dari database dulu
    await prisma.socialMedia.delete({
      where: { id },
    });

    // Cleanup image Cloudinary (tidak bikin request gagal kalau error)
    if (existing.photo) {
      try {
        await deleteFromCloudinary(existing.photo);
      } catch (err) {
        console.error("Cloudinary delete error:", err);
      }
    }

    return NextResponse.json(
      ApiResponse.success(
        {
          id: existing.id,
          platform: existing.platform,
        },
        "Social media berhasil dihapus",
      ),
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting social media:", error);

    return NextResponse.json(
      ApiResponse.error("Terjadi kesalahan saat menghapus social media", 500),
      { status: 500 },
    );
  }
});
