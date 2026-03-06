import { NextResponse } from "next/server";
import { prisma } from "@/infrastructure/database/prisma";

export const revalidate = 3600;

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: {
        createdAt: "desc",
      },
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
    });

    const formattedProjects = projects.map((project) => ({
      id: project.id,
      title: project.title,
      description: project.description,
      link: project.link,
      projectImage: project.projectImage,
      techStack: project.techStack,
    }));

    return NextResponse.json(formattedProjects);
  } catch (error) {
    console.error("PUBLIC PROJECTS ERROR:", error);

    return NextResponse.json(
      { message: "Failed to fetch projects" },
      { status: 500 },
    );
  }
}
