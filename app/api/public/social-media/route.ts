import { prisma } from "@/infrastructure/database/prisma";
import { NextResponse } from "next/server";

export const revalidate = 3600;

export async function GET() {
  try {
    const socials = await prisma.socialMedia.findMany({
      select: {
        platform: true,
        url: true,
        photo: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return NextResponse.json(socials);
  } catch (error) {
    console.error("PUBLIC SOCIAL MEDIA ERROR:", error);

    return NextResponse.json(
      { message: "Failed to fetch social media" },
      { status: 500 },
    );
  }
}
