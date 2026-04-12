import { prisma } from "@/infrastructure/database/prisma";
import { SocialMediaResponse } from "./social-media.type";

export async function getSocialMedia(
  page: number = 1,
  limit: number = 5,
): Promise<SocialMediaResponse> {
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    prisma.socialMedia.findMany({
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        platform: true,
        url: true,
        photo: true,
      },
    }),
    prisma.socialMedia.count(),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    items,
    pagination: {
      page,
      limit,
      total,
      totalPages,
    },
  };
}
