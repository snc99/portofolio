import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";
import { sessionRepository } from "@/repositories/session.repository";

export async function requireAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get("pw_token")?.value;

  if (!token) throw new Error("Unauthorized");

  const decoded = verifyToken(token);

  const active = await sessionRepository.get(decoded.id);
  if (active !== token) {
    throw new Error("Session expired");
  }

  return decoded;
}
