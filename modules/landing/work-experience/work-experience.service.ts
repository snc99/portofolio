import { prisma } from "@/infrastructure/database/prisma";
import { WorkExperienceData } from "./work-experience.type";

export async function getWorkExperiences(): Promise<WorkExperienceData[]> {
  return prisma.workExperience.findMany({
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
      location: true,
    },
  });
}
