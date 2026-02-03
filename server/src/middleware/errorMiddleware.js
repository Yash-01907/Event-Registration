class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  // Prisma unique constraint error
  if (err.code === "P2002") {
    err.message = "Duplicate field value entered";
    err.statusCode = 400;
  }

  // Prisma record not found error
  if (err.code === "P2025") {
    err.message = "Record not found";
    err.statusCode = 404;
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    err.message = "Invalid token";
    err.statusCode = 401;
  }

  if (err.name === "TokenExpiredError") {
    err.message = "Token expired";
    err.statusCode = 401;
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

export { AppError, errorHandler };
