import { prisma } from "@/lib/prisma";

export const userRepository = {
  async findByEmail(email: string) {
    return prisma.admin.findUnique({
      where: { email },
    });
  },

  async findById(id: string) {
    return prisma.admin.findUnique({
      where: { id },
      select: {
        id: true,
        nama: true,
        email: true,
      },
    });
  },
};
