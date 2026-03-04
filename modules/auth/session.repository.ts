import { redis } from "@/infrastructure/cache/redis";

export const sessionRepository = {
  async save(userId: string, token: string, ttl: number) {
    await redis.set(`session:${userId}`, token, { ex: ttl });
  },

  async get(userId: string) {
    return redis.get<string>(`session:${userId}`);
  },

  async delete(userId: string) {
    return redis.del(`session:${userId}`);
  },
};
