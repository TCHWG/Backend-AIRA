const ApiError = require("./api_error");

function apiErrorHandler(err, req, res, next) {
  if (err instanceof ApiError) {
    res.status(err.code).json({
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
