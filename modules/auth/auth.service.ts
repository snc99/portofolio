import "server-only";
import bcrypt from "bcryptjs";
import { signToken, SESSION_DURATION } from "@/infrastructure/security/jwt";
import { sessionRepository } from "@/modules/auth/session.repository";
import { userRepository } from "@/modules/user/user.repository";

type LoginInput = {
  email: string;
  password: string;
};

export const authService = {
  async login({ email, password }: LoginInput) {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new Error("Invalid credentials");
    }

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
