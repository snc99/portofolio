// work-experience.repository.ts
import { prisma } from "@/infrastructure/database/prisma";

export const workExperienceRepository = {
  findAll() {
    return prisma.workExperience.findMany();
  },

  update(id: string, data: any) {
    return prisma.workExperience.update({
      where: { id },
      data,
    });
  },

  delete(id: string) {
    return prisma.workExperience.delete({
      where: { id },
    });
  },
};
