import { getAbout } from "@/modules/landing/about/about.service";
import { ApiResponse } from "@/shared/response/api-response.util";

export const revalidate = 3600;

export async function GET() {
  try {
    const about = await getAbout();

    if (!about) {
      return ApiResponse.error("About data not found", "ABOUT_NOT_FOUND", 404);
    }

    return ApiResponse.success(about, "About data retrieved successfully");
  } catch (error) {
    console.error(error);

    return ApiResponse.error(
      "Failed to fetch about data",
      "INTERNAL_SERVER_ERROR",
      500,
    );
  }
}
