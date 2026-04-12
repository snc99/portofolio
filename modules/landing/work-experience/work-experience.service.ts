import { prisma } from "@/infrastructure/database/prisma";
import { WorkExperienceData } from "./work-experience.type";

export async function getWorkExperiences(
  page: number = 1,
  limit: number = 5,
): Promise<WorkExperienceData[]> {
  return prisma.workExperience.findMany({
    skip: (page - 1) * limit,
    take: limit,
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
