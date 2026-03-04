import "server-only";
import jwt, { JwtPayload } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}

// 🔥 1 jam
export const SESSION_DURATION = 60 * 60; // detik

export interface TokenPayload extends JwtPayload {
  id: string;
  email: string;
}

export const signToken = (payload: Omit<TokenPayload, "iat" | "exp">) => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: SESSION_DURATION,
  });
};

export const verifyToken = (token: string): TokenPayload => {
  return jwt.verify(token, JWT_SECRET) as TokenPayload;
};
