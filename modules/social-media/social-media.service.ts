import { socialMediaRepository } from "./social-media.repository";

export const socialMediaService = {
  async getPaginatedSocialMedia(page: number, limit: number) {
    const safePage = page < 1 ? 1 : page;
    const safeLimit = limit > 50 ? 50 : limit;

    const skip = (safePage - 1) * safeLimit;

    const [items, total] = await Promise.all([
      socialMediaRepository.findMany(skip, safeLimit),
      socialMediaRepository.count(),
    ]);

    return {
      items,
      meta: {
        page: safePage,
        limit: safeLimit,
        total,
        totalPages: Math.ceil(total / safeLimit),
      },
    };
  },
};
