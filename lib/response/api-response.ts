export const ApiResponse = {
  success<T>(data: T, message = "OK", status = 200) {
    return {
      success: true,
      status,
      message,
      data,
    };
  },

  error(message = "Error", status = 500) {
    return {
      success: false,
      status,
      message,
    };
  },
};
