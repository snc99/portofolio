import { NextResponse } from "next/server";
import { verifyToken } from "@/infrastructure/security/jwt";
import { sessionRepository } from "@/modules/auth/session.repository";

export async function GET(req: Request) {
  const auth = req.headers.get("authorization");
  const token = auth?.replace("Bearer ", "");

  if (!token) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const payload = verifyToken(token);
    const activeToken = await sessionRepository.get(payload.id);

    if (!activeToken || activeToken !== token) {
      return new NextResponse("Invalid", { status: 401 });
    }

    return new NextResponse("OK", { status: 200 });
  } catch {
    return new NextResponse("Unauthorized", { status: 401 });
  }
}
