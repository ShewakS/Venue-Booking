const ApiError = require("../utils/ApiError");
const logger = require("../utils/logger");

const errorHandler = (error, req, res, next) => {
	if (error?.type === "entity.too.large") {
		res.status(413).json({
			success: false,
			message: "Request payload is too large. Please upload a smaller image.",
			errors: [],
		});
		return;
	}

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
