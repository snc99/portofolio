export class ApiResponse {
  static success<T>(data: T, message = "Success") {
    return {
      success: true,
      message,
      data,
    };
  }

  static error(message: string, code: string = "INTERNAL_ERROR") {
    return {
      success: false,
      error: {
        message,
        code,
      },
    };
  }
}
