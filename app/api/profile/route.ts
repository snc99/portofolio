import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  UpdateProfileSchema,
  CreateProfileSchema,
} from "@/lib/validation/profile";
import {
  deleteFromCloudinary,
  updateCloudinaryFile,
  uploadToCloudinary,
} from "@/lib/cloudinary";
import { ApiResponse } from "@/lib/response/api-response";
import { withAuth } from "@/lib/with-auth";

export const GET = withAuth(async () => {
  const hero = await prisma.profile.findFirst({
    select: {
      id: true,
      motto: true,
      cvLink: true,
      cvFilename: true,
    },
  });

  return NextResponse.json(
    ApiResponse.success(hero, "Data profile berhasil diambil"),
    { status: 200 },
  );
});

export const POST = withAuth(async (req) => {
  try {
    const formData = await req.formData();

    const result = CreateProfileSchema.safeParse({
      motto: formData.get("motto"),
      cv: formData.get("cv"),
    });

    if (!result.success) {
      return NextResponse.json(
        ApiResponse.error(
          result.error.errors.map((e) => e.message).join(", "),
          400,
        ),
        { status: 400 },
      );
    }

    const { motto, cv } = result.data;

    const existingData = await prisma.profile.findFirst();

    if (existingData && existingData.motto === motto) {
      return NextResponse.json(
        ApiResponse.error("Motto baru tidak boleh sama dengan yang lama.", 409),
        { status: 409 },
      );
    }

    const uploadedUrl = await uploadToCloudinary(cv, "cv_files");
    const originalName = cv.name;

    let profile;

    if (existingData) {
      profile = await prisma.profile.update({
        where: { id: existingData.id },
        data: { motto, cvLink: uploadedUrl, cvFilename: originalName },
      });
    } else {
      profile = await prisma.profile.create({
        data: { motto, cvLink: uploadedUrl, cvFilename: originalName },
      });
    }

    return NextResponse.json(
      ApiResponse.success(profile, "Profile berhasil disimpan"),
      { status: 200 },
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      ApiResponse.error("Terjadi kesalahan, coba lagi nanti.", 500),
      { status: 500 },
    );
  }
});

export const PUT = withAuth(async (req) => {
  try {
    const existing = await prisma.profile.findFirst();

    if (!existing) {
      return NextResponse.json(ApiResponse.error("Profile belum dibuat", 404), {
        status: 404,
      });
    }

    const formData = await req.formData();

    const result = UpdateProfileSchema.safeParse({
      motto: formData.get("motto"),
      cv: formData.get("cv"),
    });

    if (!result.success) {
      return NextResponse.json(
        ApiResponse.error(
          result.error.errors.map((e) => e.message).join(", "),
          400,
        ),
        { status: 400 },
      );
    }

    const { motto, cv } = result.data;

    const isMottoChanged =
      typeof motto === "string" && existing.motto.trim() !== motto.trim();

    const isCvChanged = !!cv;

    if (!isMottoChanged && !isCvChanged) {
      return NextResponse.json(
        ApiResponse.error("Minimal satu perubahan harus dilakukan", 400),
        { status: 400 },
      );
    }

    let cvUrl = existing.cvLink;
    let cvFilename = existing.cvFilename;

    if (cv) {
      const uploadedUrl = await updateCloudinaryFile(
        existing.cvLink ?? "",
        cv,
        "cv_files",
      );

      cvUrl = uploadedUrl;
      cvFilename = cv.name;
    }

    const updated = await prisma.profile.update({
      where: { id: existing.id },
      data: {
        motto: isMottoChanged ? motto : existing.motto,
        cvLink: cvUrl,
        cvFilename: cvFilename,
      },
    });

    return NextResponse.json(
      ApiResponse.success(updated, "Profile berhasil diperbarui"),
      { status: 200 },
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      ApiResponse.error("Gagal memperbarui profile", 500),
      { status: 500 },
    );
  }
});

export const DELETE = withAuth(async () => {
  try {
    const existing = await prisma.profile.findFirst({
      select: { id: true, cvLink: true },
    });

    if (!existing) {
      return NextResponse.json(
        ApiResponse.error("Profile tidak ditemukan", 404),
        { status: 404 },
      );
    }

    if (existing.cvLink) {
      await deleteFromCloudinary(existing.cvLink);
    }

    await prisma.profile.delete({
      where: { id: existing.id },
    });

    return NextResponse.json(
      ApiResponse.success(null, "Profile berhasil dihapus"),
      { status: 200 },
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      ApiResponse.error("Gagal menghapus profile", 500),
      { status: 500 },
    );
  }
});
