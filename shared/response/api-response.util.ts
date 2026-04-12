import { NextResponse } from "next/server";

export class ApiResponse {
  static success<T>(data: T, message = "Success", status = 200) {
    return NextResponse.json(
      {
        success: true,
        message,
        data,
      },
      { status },
    );
  }

  static error(message: string, code: string = "INTERNAL_ERROR", status = 500) {
    return NextResponse.json(
      {
        success: false,
        error: {
          message,
          code,
        },
      },
      { status },
    );
  }
}
