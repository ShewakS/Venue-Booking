const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const ApiError = require("../utils/ApiError");
const env = require("../config/env");
const { User } = require("../models");
const { validateLogin, validateRegister } = require("../validators/auth.validator");

const SALT_ROUNDS = 10;
const isBcryptHash = (value) => typeof value === "string" && /^\$2[aby]\$\d{2}\$/.test(value);

const sanitizeUser = (user) => {
	// user is a Sequelize instance or plain object
	const plain = user.get ? user.get({ plain: true }) : { ...user };
	const { password, ...safeUser } = plain;
	return safeUser;
};

const createToken = (user) =>
	jwt.sign({ sub: String(user.id), role: user.role, name: user.name }, env.jwtSecret, {
		expiresIn: env.jwtExpiresIn,
	});

const login = async (payload = {}) => {
	const { isValid, errors, value } = validateLogin(payload);
	if (!isValid) {
		throw ApiError.badRequest("Invalid login payload", errors);
	}

	const user = await User.findOne({ where: { email: value.email } });
	if (!user) {
		throw ApiError.unauthorized("Account not found. Please register first.");
	}

	let isPasswordValid = false;

	if (isBcryptHash(user.password)) {
		isPasswordValid = await bcrypt.compare(value.password, user.password);
	} else {
		// Auto-upgrade legacy plain-text passwords on first login
		isPasswordValid = user.password === value.password;

		if (isPasswordValid) {
			user.password = await bcrypt.hash(value.password, SALT_ROUNDS);
			await user.save();
		}
	}

	if (!isPasswordValid) {
		throw ApiError.unauthorized("Invalid email or password");
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

	const emailInUse = await User.findOne({ where: { email: value.email } });
	if (emailInUse) {
		throw ApiError.conflict("Email is already in use");
	}

	const hashedPassword = await bcrypt.hash(value.password, SALT_ROUNDS);

	const user = await User.create({
		name: value.name,
		email: value.email,
		password: hashedPassword,
		role: value.role,
		phone: value.phone,
		roleDescription: value.roleDescription,
	});

	return {
		token: createToken(user),
		user: sanitizeUser(user),
	};
};

const getCurrentUser = async (userId) => {
	const user = await User.findByPk(userId);

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
