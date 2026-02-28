const ApiError = require("../utils/ApiError");
const { verifyToken, getCurrentUser } = require("../services/auth.service");

const requireAuth = async (req, res, next) => {
	try {
		const authHeader = req.headers.authorization || "";
		const [scheme, token] = authHeader.split(" ");

		if (scheme !== "Bearer" || !token) {
			throw ApiError.unauthorized("Authorization token is required");
		}

		const decoded = verifyToken(token);
		const user = await getCurrentUser(decoded.sub);
		req.user = user;
		next();
	} catch (error) {
		next(error);
	}
};

module.exports = {
	requireAuth,
};
