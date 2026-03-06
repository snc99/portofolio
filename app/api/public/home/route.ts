import { prisma } from "@/infrastructure/database/prisma";
import { NextResponse } from "next/server";

export const revalidate = 3600;

export async function GET() {
  try {
    const [profile, about, skills, workExperience, projects, socialMedia] =
      await Promise.all([
        prisma.profile.findFirst({
          select: {
            motto: true,
            cvLink: true,
          },
        }),

        prisma.about.findFirst({
          select: {
            description: true,
          },
        }),

        prisma.skill.findMany({
          select: {
            id: true,
            name: true,
            photo: true,
          },
        }),

        prisma.workExperience.findMany({
          orderBy: { startDate: "desc" },
          select: {
            id: true,
            companyName: true,
            position: true,
            startDate: true,
            endDate: true,
            isPresent: true,
            description: true,
          },
        }),

        prisma.project.findMany({
          take: 5,
          orderBy: { createdAt: "desc" },
          include: {
            techStack: {
              include: {
                skill: {
                  select: {
                    name: true,
                    photo: true,
                  },
                },
              },
            },
          },
        }),

        prisma.socialMedia.findMany({
          select: {
            platform: true,
            url: true,
            photo: true,
          },
        }),
      ]);

    return NextResponse.json({
      profile,
      about,
      skills,
      workExperience,
      projects,
      socialMedia,
    });
  } catch (error) {
    console.error("HOME API ERROR:", error);

    return NextResponse.json(
      { message: "Failed to fetch home data" },
      { status: 500 },
    );
  }
}
