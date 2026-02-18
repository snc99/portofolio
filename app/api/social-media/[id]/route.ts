import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { UpdateSocialMediaSchema } from "@/lib/validation/sosmed";
import { uploadToCloudinary, deleteFromCloudinary } from "@/lib/cloudinary";
import { ApiResponse } from "@/lib/response/api-response";
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

    const isPlatformChanged = platform && platform !== existing.platform;

    const isUrlChanged = url && url !== existing.url;

    const isPhotoChanged = photoFile && photoFile instanceof File;

    if (!isPlatformChanged && !isUrlChanged && !isPhotoChanged) {
      return NextResponse.json(
        ApiResponse.error("Minimal satu perubahan harus dilakukan", 400),
        { status: 400 },
      );
    }

    const updateData: {
      platform?: string;
      url?: string;
      photo?: string;
    } = {};

    // 🔥 Duplicate check hanya kalau platform berubah
    if (isPlatformChanged) {
      const duplicate = await prisma.socialMedia.findFirst({
        where: {
          platform,
          NOT: { id }, // penting supaya gak ngecek dirinya sendiri
        },
      });

      if (duplicate) {
        return NextResponse.json(
          ApiResponse.error("Platform sudah digunakan", 409),
          { status: 409 },
        );
      }

      updateData.platform = platform!;
    }

    if (isUrlChanged) {
      updateData.url = url!;
    }

    if (isPhotoChanged && photoFile instanceof File) {
      const uploadedUrl = await uploadToCloudinary(photoFile, "social-media");

      // Hapus foto lama hanya kalau upload sukses
      if (existing.photo) {
        try {
          await deleteFromCloudinary(existing.photo);
        } catch (err) {
          console.error("Cloudinary delete error:", err);
        }
      }

      updateData.photo = uploadedUrl;
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
    console.error("Error:", error);

    return NextResponse.json(ApiResponse.error("Terjadi kesalahan", 500), {
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
