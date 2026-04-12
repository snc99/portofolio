import { prisma } from "@/infrastructure/database/prisma";
import { ProjectItem } from "./project.type";

export async function getProjects(
  page: number = 1,
  limit: number = 5,
): Promise<ProjectItem[]> {
  const projects = await prisma.project.findMany({
    skip: (page - 1) * limit,
    take: limit,
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      title: true,
      link: true,
      description: true,
      projectImage: true,
      techStack: {
        select: {
          skill: {
            select: {
              id: true,
              name: true,
              photo: true,
            },
          },
        },
      },
    },
  });

  return projects.map((project) => ({
    id: project.id,
    title: project.title,
    link: project.link,
    description: project.description,
    projectImage: project.projectImage,
    skills: project.techStack.map((ts) => ts.skill),
  }));
}
