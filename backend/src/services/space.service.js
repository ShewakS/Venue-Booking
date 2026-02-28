const ApiError = require("../utils/ApiError");
const Space = require("../models/Space");
const Booking = require("../models/Booking");
const {
	validateCreateSpace,
	validateUpdateSpace,
	validateSpaceQuery,
} = require("../validators/space.validator");

const getNextSpaceLegacyId = async () => {
	const latest = await Space.findOne().sort({ legacyId: -1 }).select("legacyId").lean();
	return latest?.legacyId ? latest.legacyId + 1 : 1;
};

const listSpaces = async (query = {}) => {
	const { isValid, errors, value } = validateSpaceQuery(query);
	if (!isValid) {
		throw ApiError.badRequest("Invalid space query", errors);
	}

	const mongoQuery = {};

	if (value.type) {
		mongoQuery.type = new RegExp(`^${value.type.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i");
	}

	if (value.minCapacity !== undefined || value.maxCapacity !== undefined) {
		mongoQuery.capacity = {};
		if (value.minCapacity !== undefined) {
			mongoQuery.capacity.$gte = value.minCapacity;
		}
		if (value.maxCapacity !== undefined) {
			mongoQuery.capacity.$lte = value.maxCapacity;
		}
	}

	return Space.find(mongoQuery).sort({ legacyId: 1 });
};

const getSpaceById = async (spaceId) => {
	const id = Number(spaceId);
	const space = await Space.findOne({ legacyId: id });

	if (!space) {
		throw ApiError.notFound("Space not found");
	}

	return space;
};

const createSpace = async (payload = {}) => {
	const { isValid, errors, value } = validateCreateSpace(payload);
	if (!isValid) {
		throw ApiError.badRequest("Invalid space payload", errors);
	}

	const duplicate = await Space.exists({
		name: new RegExp(`^${value.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i"),
	});
	if (duplicate) {
		throw ApiError.conflict("Space with the same name already exists");
	}

	const legacyId = await getNextSpaceLegacyId();
	return Space.create({ ...value, legacyId });
};

const updateSpace = async (payload = {}) => {
	const { isValid, errors, value } = validateUpdateSpace(payload);
	if (!isValid) {
		throw ApiError.badRequest("Invalid update payload", errors);
	}

	const existing = await Space.findOne({ legacyId: value.id });
	if (!existing) {
		throw ApiError.notFound("Space not found");
	}

	const duplicate = await Space.exists({
		legacyId: { $ne: value.id },
		name: new RegExp(`^${value.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i"),
	});
	if (duplicate) {
		throw ApiError.conflict("Another space with the same name already exists");
	}

	const updated = await Space.findOneAndUpdate(
		{ legacyId: value.id },
		{ ...value, legacyId: value.id },
		{ new: true, runValidators: true }
	);
	return updated;
};

const deleteSpace = async (spaceId) => {
	const id = Number(spaceId);
	const removedSpace = await Space.findOneAndDelete({ legacyId: id });
	if (!removedSpace) {
		throw ApiError.notFound("Space not found");
	}

	await Booking.deleteMany({ spaceId: removedSpace.legacyId });

	return removedSpace;
};

module.exports = {
	listSpaces,
	getSpaceById,
	createSpace,
	updateSpace,
	deleteSpace,
};

