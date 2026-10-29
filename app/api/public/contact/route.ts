import { getContact } from "@/modules/landing/contact/contact.service";
import { ApiResponse } from "@/shared/response/api-response.util";

export const revalidate = 3600;

export async function GET() {
  try {
    const contact = await getContact();

    if (!contact) {
      return ApiResponse.error(
        "Contact data not found",
        "CONTACT_NOT_FOUND",
        404,
      );
    }

    return ApiResponse.success(
      contact,
      "Contact data retrieved successfully",
    );
  } catch (error) {
    console.error(error);

    return ApiResponse.error(
      "Failed to fetch contact data",
      "INTERNAL_SERVER_ERROR",
      500,
    );
  }
}