const ApiError = require("../utils/ApiError");
const { USER_ROLES } = require("../validators/auth.validator");
const User = require("../models/User");

const sanitizeUser = (user) => {
	const document = user.toJSON ? user.toJSON() : user;
	const { password, ...safeUser } = document;
	return safeUser;
};

const listUsers = async (query = {}) => {
	const role = typeof query.role === "string" ? query.role.trim().toLowerCase() : "";

	if (role && !USER_ROLES.includes(role)) {
		throw ApiError.badRequest(`role must be one of: ${USER_ROLES.join(", ")}`);
	}

	const users = role ? await User.find({ role }).sort({ createdAt: -1 }) : await User.find().sort({ createdAt: -1 });
	return users.map(sanitizeUser);
};

const getUserById = async (userId) => {
	const user = await User.findById(userId);

	if (!user) {
		throw ApiError.notFound("User not found");
	}

	return sanitizeUser(user);
};

const updateUser = async (userId, payload = {}) => {
	const existing = await User.findById(userId);

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

	const updated = await User.findByIdAndUpdate(
		userId,
		{
			...(name !== undefined ? { name } : {}),
			...(role !== undefined ? { role } : {}),
		},
		{ new: true, runValidators: true }
	);

	return sanitizeUser(updated);
};

const deleteUser = async (userId) => {
	const removed = await User.findByIdAndDelete(userId);

	if (!removed) {
		throw ApiError.notFound("User not found");
	}

	return sanitizeUser(removed);
};

module.exports = {
	listUsers,
	getUserById,
	updateUser,
	deleteUser,
};

