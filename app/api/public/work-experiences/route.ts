import { getWorkExperiences } from "@/modules/landing/work-experience/work-experience.service";
import { ApiResponse } from "@/shared/response/api-response.util";

export const revalidate = 3600;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 5;

    const workExperiences = await getWorkExperiences(page, limit);

    return ApiResponse.success(
      workExperiences,
      "Work experiences retrieved successfully",
    );
  } catch (error) {
    console.error(error);

    return ApiResponse.error(
      "Failed to fetch work experiences",
      "INTERNAL_SERVER_ERROR",
      500,
    );
  }
}
