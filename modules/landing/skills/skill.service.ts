import { prisma } from "@/infrastructure/database/prisma";

export async function getSkills(page: number = 1, limit: number = 10) {
  const skip = (page - 1) * limit;

  const [skills, total] = await Promise.all([
    prisma.skill.findMany({
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        name: true,
        photo: true,
        level: true,
      },
    }),
    prisma.skill.count(),
  ]);

  return {
    data: skills,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}
