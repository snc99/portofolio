import bcrypt from "bcrypt";
import { signToken } from "@/lib/jwt";
import { sessionRepository } from "@/repositories/session.repository";
import { userRepository } from "@/repositories/user.repository";

export const authService = {
  async login(email: string, password: string) {
    const user = await userRepository.findByEmail(email);
    if (!user) return null;

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return null;

    const token = signToken({ id: user.id });

    const decoded: any = JSON.parse(
      Buffer.from(token.split(".")[1], "base64").toString(),
    );

    const now = Math.floor(Date.now() / 1000);
    const ttl = decoded.exp - now;

    await sessionRepository.save(user.id, token, ttl);

    return {
      token,
      user: {
        id: user.id,
        nama: user.nama,
        email: user.email,
      },
    };
  },

  async logout(userId: string) {
    await sessionRepository.delete(userId);
  },
};
