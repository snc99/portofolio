import { prisma } from "@/infrastructure/database/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const profile = await prisma.profile.findFirst({
      select: {
        motto: true,
        cvLink: true,
        cvFilename: true,
        photo: true,
      },
    });

    if (!profile) {
      return NextResponse.json(
        { message: "Profile not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        motto: profile.motto,
        cvLink: profile.cvLink,
        cvFilename: profile.cvFilename,
        photo: profile.photo,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("PUBLIC PROFILE ERROR:", error);

    return NextResponse.json(
      { message: "Failed to fetch profile" },
      { status: 500 },
    );
  }
}
