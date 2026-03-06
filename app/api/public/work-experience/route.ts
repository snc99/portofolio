import { NextResponse } from "next/server";
import { prisma } from "@/infrastructure/database/prisma";

export const revalidate = 3600;

export async function GET() {
  try {
    const experiences = await prisma.workExperience.findMany({
      orderBy: {
        startDate: "desc",
      },
      select: {
        id: true,
        companyName: true,
        position: true,
        startDate: true,
        endDate: true,
        isPresent: true,
        description: true,
      },
    });

    return NextResponse.json(experiences);
  } catch (error) {
    console.error("PUBLIC WORK EXPERIENCE ERROR:", error);

    return NextResponse.json(
      { message: "Failed to fetch work experience" },
      { status: 500 },
    );
  }
}
