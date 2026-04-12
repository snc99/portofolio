import { prisma } from "@/infrastructure/database/prisma";
import { ProfileData } from "./profile.type";

export async function getProfile(): Promise<ProfileData | null> {
  return prisma.profile.findFirst({
    select: {
      photo: true,
      motto: true,
      cvLink: true,
      cvFilename: true,
    },
  });
}
