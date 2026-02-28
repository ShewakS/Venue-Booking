const jwt = require("jsonwebtoken");
const ApiError = require("../utils/ApiError");
const env = require("../config/env");
const User = require("../models/User");
const { validateLogin, validateRegister } = require("../validators/auth.validator");

const sanitizeUser = (user) => {
	const document = user.toJSON ? user.toJSON() : user;
	const { password, ...safeUser } = document;
	return safeUser;
};

const createToken = (user) =>
	jwt.sign({ sub: String(user._id), role: user.role, name: user.name }, env.jwtSecret, {
		expiresIn: env.jwtExpiresIn,
	});

const login = async (payload = {}) => {
	const { isValid, errors, value } = validateLogin(payload);
	if (!isValid) {
		throw ApiError.badRequest("Invalid login payload", errors);
	}

	let user = await User.findOne({
		name: new RegExp(`^${value.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i"),
		role: value.role,
	});

	if (!user) {
		user = await User.create({
			name: value.name,
			role: value.role,
			email: "",
			password: "",
		});
	}

	return {
		token: createToken(user),
		user: sanitizeUser(user),
	};
};

const register = async (payload = {}) => {
	const { isValid, errors, value } = validateRegister(payload);
	if (!isValid) {
		throw ApiError.badRequest("Invalid registration payload", errors);
	}

	const emailInUse = await User.exists({ email: value.email });
	if (emailInUse) {
		throw ApiError.conflict("Email is already in use");
	}

	const user = await User.create({
		name: value.name,
		email: value.email,
		password: value.password,
		role: value.role,
	});

	return {
		token: createToken(user),
		user: sanitizeUser(user),
	};
};

const getCurrentUser = async (userId) => {
	const user = await User.findById(userId);

	if (!user) {
		throw ApiError.notFound("User not found");
	}

	return sanitizeUser(user);
};

const verifyToken = (token) => {
	try {
		return jwt.verify(token, env.jwtSecret);
	} catch (error) {
		throw ApiError.unauthorized("Invalid or expired token");
	}
};

module.exports = {
	login,
	register,
	getCurrentUser,
	verifyToken,
};

