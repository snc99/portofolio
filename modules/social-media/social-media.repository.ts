import { prisma } from "@/infrastructure/database/prisma";

export const socialMediaRepository = {
  async findMany(skip: number, take: number) {
    return prisma.socialMedia.findMany({
      skip,
      take,
      orderBy: { createdAt: "desc" },
    });
  },

  async count() {
    return prisma.socialMedia.count();
  },
};
