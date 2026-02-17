import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";
import { sessionRepository } from "@/repositories/session.repository";

export async function requireAuth(req: Request) {
  const cookieHeader = req.headers.get("cookie");

  if (!cookieHeader) {
    throw new Error("Unauthorized");
  }

  const match = cookieHeader.match(/pw_token=([^;]+)/);
  const token = match?.[1];

  if (!token) {
    throw new Error("Unauthorized");
  }

  // verify token
  const decoded = verifyToken(token);

  if (!decoded) {
    throw new Error("Unauthorized");
  }

  return decoded;
}
