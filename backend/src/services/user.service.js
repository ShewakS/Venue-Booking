const ApiError = require("../utils/ApiError");
const { USER_ROLES } = require("../validators/auth.validator");
const { dataStore } = require("./store");

const sanitizeUser = (user) => {
	const { password, ...safeUser } = user;
	return safeUser;
};

const listUsers = (query = {}) => {
	const role = typeof query.role === "string" ? query.role.trim().toLowerCase() : "";

	if (role && !USER_ROLES.includes(role)) {
		throw ApiError.badRequest(`role must be one of: ${USER_ROLES.join(", ")}`);
	}

	const users = role ? dataStore.users.filter((user) => user.role === role) : dataStore.users;
	return users.map(sanitizeUser);
};

const getUserById = (userId) => {
	const id = Number(userId);
	const user = dataStore.users.find((item) => item.id === id);

	if (!user) {
		throw ApiError.notFound("User not found");
	}

	return sanitizeUser(user);
};

const updateUser = (userId, payload = {}) => {
	const id = Number(userId);
	const index = dataStore.users.findIndex((user) => user.id === id);

	if (index === -1) {
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

	const updated = {
		...dataStore.users[index],
		...(name !== undefined ? { name } : {}),
		...(role !== undefined ? { role } : {}),
		updatedAt: new Date().toISOString(),
	};

	dataStore.users[index] = updated;
	return sanitizeUser(updated);
};

const deleteUser = (userId) => {
	const id = Number(userId);
	const index = dataStore.users.findIndex((user) => user.id === id);

	if (index === -1) {
		throw ApiError.notFound("User not found");
	}

	const [removed] = dataStore.users.splice(index, 1);
	return sanitizeUser(removed);
};

module.exports = {
	listUsers,
	getUserById,
	updateUser,
	deleteUser,
};

