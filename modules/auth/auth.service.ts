import "server-only";
import bcrypt from "bcryptjs";
import { signToken, SESSION_DURATION } from "@/infrastructure/security/jwt";
import { sessionRepository } from "@/modules/auth/session.repository";
import { userRepository } from "@/modules/user/user.repository";

export const authService = {
  async login({ email, password }: { email: string; password: string }) {
    const user = await userRepository.findByEmail(email);
    if (!user) return null;

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return null;

    const token = signToken({
      id: user.id,
      email: user.email,
    });

    await sessionRepository.save(user.id, token, SESSION_DURATION);
    return {
      user: {
        id: user.id,
        email: user.email,
      },
      token,
    };
  },
};
