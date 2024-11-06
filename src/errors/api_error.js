class ApiError {
  constructor(code, message, details = null) {
    this.success = false;
    this.code = code;
    this.status = this.getStatusText(code);
    this.message = message;
    if (details) this.details = details;
  }

  getStatusText(code) {
    const statusTexts = {
      400: "Bad Request",
      401: "Unauthorized",
      404: "Not Found",
      500: "Internal Server Error",
    };
    return statusTexts[code] || "Error";
  }

  static badRequest(msg, details = null) {
    return new ApiError(400, msg, details);
  }

  static unauthorized(msg) {
    return new ApiError(401, msg);
  }

  static notFound(msg) {
    return new ApiError(404, msg);
  }

  static internalServerError(msg) {
    return new ApiError(500, msg);
  }
}
module.exports = ApiError;
