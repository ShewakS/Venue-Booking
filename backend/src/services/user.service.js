const ApiError = require("../utils/ApiError");
const { User } = require("../models");
const { USER_ROLES } = require("../validators/auth.validator");

const sanitizeUser = (user) => {
	const plain = user.get ? user.get({ plain: true }) : { ...user };
	const { password, ...safeUser } = plain;
	return safeUser;
};

const listUsers = async (query = {}) => {
	const role = typeof query.role === "string" ? query.role.trim().toLowerCase() : "";

	if (role && !USER_ROLES.includes(role)) {
		throw ApiError.badRequest(`role must be one of: ${USER_ROLES.join(", ")}`);
	}

	const where = role ? { role } : {};
	const users = await User.findAll({ where, order: [["createdAt", "DESC"]] });
	return users.map(sanitizeUser);
};

const getUserById = async (userId) => {
	const user = await User.findByPk(userId);

	if (!user) {
		throw ApiError.notFound("User not found");
	}

	return sanitizeUser(user);
};

const updateUser = async (userId, payload = {}) => {
	const existing = await User.findByPk(userId);

	if (!existing) {
		throw ApiError.notFound("User not found");
	}

	const name = typeof payload.name === "string" ? payload.name.trim() : undefined;
	const role = typeof payload.role === "string" ? payload.role.trim().toLowerCase() : undefined;

	if (name !== undefined && !name) {
		throw ApiError.badRequest("name cannot be empty");
	}

	if (name && name.length > 80) {
		throw ApiError.badRequest("name must be at most 80 characters long");
	}

	if (role !== undefined && !USER_ROLES.includes(role)) {
		throw ApiError.badRequest(`role must be one of: ${USER_ROLES.join(", ")}`);
	}

	await existing.update({
		...(name !== undefined ? { name } : {}),
		...(role !== undefined ? { role } : {}),
	});

	return sanitizeUser(existing);
};

const deleteUser = async (userId) => {
	const user = await User.findByPk(userId);

	if (!user) {
		throw ApiError.notFound("User not found");
	}

	await user.destroy();
	return sanitizeUser(user);
};

module.exports = {
	listUsers,
	getUserById,
	updateUser,
	deleteUser,
};
