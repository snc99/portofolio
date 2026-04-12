import { getProfile } from "@/modules/landing/profile/profile.service";
import { ApiResponse } from "@/shared/response/api-response.util";

export const revalidate = 3600;

export async function GET() {
  try {
    const profile = await getProfile();

    if (!profile) {
      return ApiResponse.error(
        "Profile data not found",
        "PROFILE_NOT_FOUND",
        404,
      );
    }

    return ApiResponse.success(profile, "Profile data retrieved successfully");
  } catch (error) {
    console.error(error);

    return ApiResponse.error(
      "Failed to fetch profile data",
      "INTERNAL_SERVER_ERROR",
      500,
    );
  }
}
