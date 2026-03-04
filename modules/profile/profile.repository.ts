import { prisma } from "@/infrastructure/database/prisma";

export const profileRepository = {
  async findLatest() {
    return prisma.profile.findFirst({
      select: {
        id: true,
        motto: true,
        cvLink: true,
        cvFilename: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  async deleteById(id: string) {
    return prisma.profile.delete({
      where: { id },
    });
  },
};
