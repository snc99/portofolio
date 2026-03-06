import { prisma } from "@/infrastructure/database/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const skills = await prisma.skill.findMany({
      select: {
        id: true,
        name: true,
        photo: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(skills);
  } catch (error) {
    console.error("PUBLIC SKILLS ERROR:", error);

    return NextResponse.json(
      { message: "Failed to fetch skills" },
      { status: 500 },
    );
  }
}
