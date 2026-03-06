import { prisma } from "@/infrastructure/database/prisma";
import { HomeData } from "./landing.types";

function ensure<T>(value: T | null, message: string): T {
  if (!value) throw new Error(message);
  return value;
}

export async function getHomeData(): Promise<HomeData> {
  const [profile, about, skills, workExperience, socialMedia, projects] =
    await Promise.all([
      prisma.profile.findFirst(),
      prisma.about.findFirst(),
      prisma.skill.findMany({
        orderBy: { createdAt: "asc" },
      }),
      prisma.workExperience.findMany({
        orderBy: { startDate: "desc" },
      }),
      prisma.socialMedia.findMany(),
      prisma.project.findMany({
        include: {
          techStack: {
            include: {
              skill: true,
            },
          },
        },
      }),
    ]);

  const safeProfile = profile ?? null;
  const safeAbout = about ?? null; // biarkan null, handle di UI
  const formattedWorkExperience = workExperience.map((exp) => ({
    id: exp.id,
    companyName: exp.companyName,
    position: exp.position,
    startDate: exp.startDate.toISOString(),
    endDate: exp.endDate ? exp.endDate.toISOString() : null,
    isPresent: exp.isPresent,
    description: exp.description,
  }));

  const formattedProjects = projects.map((project) => ({
    id: project.id,
    title: project.title,
    description: project.description,
    link: project.link,
    projectImage: project.projectImage,
    skills: project.techStack.map((t) => ({
      id: t.skill.id,
      name: t.skill.name,
      photo: t.skill.photo,
    })),
  }));

  return {
    profile: safeProfile,
    about: safeAbout,
    skills,
    workExperience: formattedWorkExperience,
    projects: formattedProjects,
    socialMedia,
  };
}
