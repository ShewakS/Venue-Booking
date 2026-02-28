const ApiError = require("../utils/ApiError");

const validate = (validator, source = "body") => (req, res, next) => {
	const payload = req[source] || {};
	const result = validator(payload);

	if (!result || typeof result !== "object") {
		return next(ApiError.internal("Validator did not return a valid result"));
	}

	if (!result.isValid) {
		return next(ApiError.badRequest("Validation failed", result.errors || []));
	}

	req.validated = req.validated || {};
	req.validated[source] = result.value;
	return next();
};

module.exports = {
	validate,
};
