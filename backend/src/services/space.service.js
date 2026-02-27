const ApiError = require("../utils/ApiError");
const {
	validateCreateSpace,
	validateUpdateSpace,
	validateSpaceQuery,
} = require("../validators/space.validator");
const { dataStore, nextId } = require("./store");

const listSpaces = (query = {}) => {
	const { isValid, errors, value } = validateSpaceQuery(query);
	if (!isValid) {
		throw ApiError.badRequest("Invalid space query", errors);
	}

	return dataStore.spaces.filter((space) => {
		if (value.type && space.type.toLowerCase() !== value.type.toLowerCase()) {
			return false;
		}

		if (value.minCapacity !== undefined && space.capacity < value.minCapacity) {
			return false;
		}

		if (value.maxCapacity !== undefined && space.capacity > value.maxCapacity) {
			return false;
		}

		return true;
	});
};

const getSpaceById = (spaceId) => {
	const id = Number(spaceId);
	const space = dataStore.spaces.find((item) => item.id === id);

	if (!space) {
		throw ApiError.notFound("Space not found");
	}

	return space;
};

const createSpace = (payload = {}) => {
	const { isValid, errors, value } = validateCreateSpace(payload);
	if (!isValid) {
		throw ApiError.badRequest("Invalid space payload", errors);
	}

	const duplicate = dataStore.spaces.some((space) => space.name.toLowerCase() === value.name.toLowerCase());
	if (duplicate) {
		throw ApiError.conflict("Space with the same name already exists");
	}

	const space = {
		id: nextId("space"),
		...value,
		createdAt: new Date().toISOString(),
	};

	dataStore.spaces.push(space);
	return space;
};

const updateSpace = (payload = {}) => {
	const { isValid, errors, value } = validateUpdateSpace(payload);
	if (!isValid) {
		throw ApiError.badRequest("Invalid update payload", errors);
	}

	const index = dataStore.spaces.findIndex((space) => space.id === value.id);
	if (index === -1) {
		throw ApiError.notFound("Space not found");
	}

	const duplicate = dataStore.spaces.some(
		(space) => space.id !== value.id && space.name.toLowerCase() === value.name.toLowerCase()
	);
	if (duplicate) {
		throw ApiError.conflict("Another space with the same name already exists");
	}

	const updated = {
		...dataStore.spaces[index],
		...value,
		updatedAt: new Date().toISOString(),
	};

	dataStore.spaces[index] = updated;
	return updated;
};

const deleteSpace = (spaceId) => {
	const id = Number(spaceId);
	const index = dataStore.spaces.findIndex((space) => space.id === id);

	if (index === -1) {
		throw ApiError.notFound("Space not found");
	}

	const [removedSpace] = dataStore.spaces.splice(index, 1);
	dataStore.bookings = dataStore.bookings.filter((booking) => booking.spaceId !== id);

	return removedSpace;
};

module.exports = {
	listSpaces,
	getSpaceById,
	createSpace,
	updateSpace,
	deleteSpace,
};

