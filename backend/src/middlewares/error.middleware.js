const ApiError = require("../utils/ApiError");
const logger = require("../utils/logger");

const errorHandler = (error, req, res, next) => {
	const normalizedError =
		error instanceof ApiError
			? error
			: ApiError.internal(error.message || "Internal server error", []);

	logger.error("Request failed", error, {
		method: req.method,
		url: req.originalUrl,
		statusCode: normalizedError.statusCode,
	});

	res.status(normalizedError.statusCode).json({
		success: false,
		message: normalizedError.message,
		errors: normalizedError.errors || [],
	});
};

module.exports = {
	errorHandler,
};
