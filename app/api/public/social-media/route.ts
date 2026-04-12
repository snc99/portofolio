import { getSocialMedia } from "@/modules/landing/social-media/social-media.service";
import { ApiResponse } from "@/shared/response/api-response.util";

export const revalidate = 3600;

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const page = Number(searchParams.get("page") ?? 1);
    const limit = Number(searchParams.get("limit") ?? 5);

    const data = await getSocialMedia(page, limit);

    return ApiResponse.success(data, "Social media retrieved successfully");
  } catch (error) {
    console.error(error);

    return ApiResponse.error(
      "Failed to fetch social media",
      "INTERNAL_SERVER_ERROR",
      500,
    );
  }
}
