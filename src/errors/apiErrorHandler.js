const ApiError = require("./apiError");

function apiErrorHandler(err, req, res, next) {
  if (err instanceof ApiError) {
    res.status(err.code).json({
      success: err.success,
      code: err.code,
      status: err.status,
      message: err.message,
      data: null,
      details: err.details || null,
    });
    return;
  }

  console.error("Unknown server error:", err);
  res.status(500).json({
    code: 500,
    status: "Internal Server Error",
    message: "Something went wrong",
    data: null,
  });
}

module.exports = apiErrorHandler;
