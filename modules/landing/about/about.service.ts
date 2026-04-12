import { prisma } from "@/infrastructure/database/prisma";

export async function getAbout() {
  return prisma.about.findFirst({
    select: {
      description: true,
      photo: true,
    },
  });
}
