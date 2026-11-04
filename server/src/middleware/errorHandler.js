function errorHandler(err, req, res, next) {
  console.error("API Error:", err);

  if (res.headersSent) {
    return next(err);
  }

  const statusCode = err.statusCode || err.status || 500;

  return res.status(statusCode).json({
    status: "error",
    message:
      statusCode === 500
        ? "Internal server error."
        : err.message || "Something went wrong.",
    data: null,
  });
}

module.exports = errorHandler;