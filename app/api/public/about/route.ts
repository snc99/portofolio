import { NextResponse } from "next/server";
import { prisma } from "@/infrastructure/database/prisma";

export async function GET() {
  try {
    const about = await prisma.about.findFirst({
      select: {
        description: true,
      },
    });

    if (!about) {
      return NextResponse.json(
        { message: "About content not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      description: about.description,
    });
  } catch (error) {
    console.error("PUBLIC ABOUT ERROR:", error);

    return NextResponse.json(
      { message: "Failed to fetch about data" },
      { status: 500 },
    );
  }
}
