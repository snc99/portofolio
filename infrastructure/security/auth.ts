import { cookies } from "next/headers";
import { verifyToken } from "@/infrastructure/security/jwt";
import { sessionRepository } from "@/modules/auth/session.repository";

export async function requireAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get("pw_token")?.value;

  if (!token) throw new Error("Unauthorized");

  const decoded = verifyToken(token);

  const activeToken = await sessionRepository.get(decoded.id);

  if (!activeToken || activeToken !== token) {
    throw new Error("Session expired");
  }

  return decoded;
}
