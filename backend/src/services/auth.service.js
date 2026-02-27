const ApiError = require("../utils/ApiError");
const { validateLogin, validateRegister } = require("../validators/auth.validator");
const { dataStore, nextId } = require("./store");

const sanitizeUser = (user) => {
	const { password, ...safeUser } = user;
	return safeUser;
};

const createToken = (user) => {
	const payload = JSON.stringify({
		sub: user.id,
		role: user.role,
		name: user.name,
		iat: Date.now(),
	});

	return Buffer.from(payload).toString("base64url");
};

const login = (payload = {}) => {
	const { isValid, errors, value } = validateLogin(payload);
	if (!isValid) {
		throw ApiError.badRequest("Invalid login payload", errors);
	}

	const existingUser = dataStore.users.find(
		(user) => user.name.toLowerCase() === value.name.toLowerCase() && user.role === value.role
	);

	const user =
		existingUser ||
		{
			id: nextId("user"),
			name: value.name,
			email: "",
			password: "",
			role: value.role,
			createdAt: new Date().toISOString(),
		};

	if (!existingUser) {
		dataStore.users.push(user);
	}

	return {
		token: createToken(user),
		user: sanitizeUser(user),
	};
};

const register = (payload = {}) => {
	const { isValid, errors, value } = validateRegister(payload);
	if (!isValid) {
		throw ApiError.badRequest("Invalid registration payload", errors);
	}

	const emailInUse = dataStore.users.some((user) => user.email.toLowerCase() === value.email);
	if (emailInUse) {
		throw ApiError.conflict("Email is already in use");
	}

	const user = {
		id: nextId("user"),
		name: value.name,
		email: value.email,
		password: value.password,
		role: value.role,
		createdAt: new Date().toISOString(),
	};

	dataStore.users.push(user);

	return {
		token: createToken(user),
		user: sanitizeUser(user),
	};
};

const getCurrentUser = (userId) => {
	const id = Number(userId);
	const user = dataStore.users.find((item) => item.id === id);

	if (!user) {
		throw ApiError.notFound("User not found");
	}

	return sanitizeUser(user);
};

module.exports = {
	login,
	register,
	getCurrentUser,
};

