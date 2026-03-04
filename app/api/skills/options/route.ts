import { prisma } from "@/infrastructure/database/prisma";
import { withAuth } from "@/shared/http/with-auth";
import { withErrorHandler } from "@/shared/http/with-error-handler";
import { NextResponse } from "next/server";

export const GET = withErrorHandler(
  withAuth(async () => {
    const skills = await prisma.skill.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
      },
    });

    const options = skills.map((skill) => ({
      value: skill.id,
      label: skill.name,
    }));

    return NextResponse.json(
      {
        success: true,
        message: "Skill options retrieved successfully",
        data: options,
      },
      { status: 200 },
    );
  }),
);
