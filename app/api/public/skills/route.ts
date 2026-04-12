import { getSkills } from "@/modules/landing/skills/skill.service";
import { ApiResponse } from "@/shared/response/api-response.util";

export const revalidate = 3600;

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const page = Number(searchParams.get("page")) || 1;
    const limit = 5;

    const skills = await getSkills(page, limit);

    if (!skills.data.length) {
      return ApiResponse.error("Skill data not found", "SKILL_NOT_FOUND", 404);
    }

    return ApiResponse.success(skills, "Skill data retrieved successfully");
  } catch (error) {
    console.error(error);

    return ApiResponse.error(
      "Failed to fetch skill data",
      "INTERNAL_SERVER_ERROR",
      500,
    );
  }
}
