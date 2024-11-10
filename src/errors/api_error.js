// src/errors/api_error.js

class ApiError extends Error {
  constructor(code, status, message, details = null) {
      super(message);
      this.success = false;
      this.code = code;
      this.status = status;
      this.message = message;
  }

  static badRequest(message, details = null) {
      return new ApiError(400, 'Bad Request', message, details);
  }

  static unauthorized(message, details = null) {
      return new ApiError(401, 'Unauthorized', message, details);
  }

  static forbidden(message, details = null) {
      return new ApiError(403, 'Forbidden', message, details);
  }

  static notFound(message, details = null) {
      return new ApiError(404, 'Not Found', message, details);
  }

  static internalServerError(message, details = null) {
      return new ApiError(500, 'Internal Server Error', message, details);
  }
}

module.exports = ApiError;
