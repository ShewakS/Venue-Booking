const { Op } = require("sequelize");
const ApiError = require("../utils/ApiError");
const { Space, Booking } = require("../models");
const {
	validateCreateSpace,
	validateUpdateSpace,
	validateSpaceQuery,
} = require("../validators/space.validator");

// ── Helper ───────────────────────────────────────────────────────────────────
const toPlain = (instance) => {
	if (!instance) return null;
	return instance.get ? instance.get({ plain: true }) : { ...instance };
};

// ── Service methods ──────────────────────────────────────────────────────────
const listSpaces = async (query = {}) => {
	const { isValid, errors, value } = validateSpaceQuery(query);
	if (!isValid) {
		throw ApiError.badRequest("Invalid space query", errors);
	}

	const where = {};

	if (value.type) {
		// Case-insensitive exact match using PostgreSQL ILIKE
		where.type = { [Op.iLike]: value.type };
	}

	if (value.minCapacity !== undefined || value.maxCapacity !== undefined) {
		where.capacity = {};
		if (value.minCapacity !== undefined) {
			where.capacity[Op.gte] = value.minCapacity;
		}
		if (value.maxCapacity !== undefined) {
			where.capacity[Op.lte] = value.maxCapacity;
		}
	}

	const spaces = await Space.findAll({ where, order: [["id", "ASC"]] });
	return spaces.map(toPlain);
};

const getSpaceById = async (spaceId) => {
	const id = Number(spaceId);
	const space = await Space.findByPk(id);

	if (!space) {
		throw ApiError.notFound("Space not found");
	}

	return toPlain(space);
};

const createSpace = async (payload = {}) => {
	const { isValid, errors, value } = validateCreateSpace(payload);
	if (!isValid) {
		throw ApiError.badRequest("Invalid space payload", errors);
	}

	// Case-insensitive duplicate name check
	const duplicate = await Space.findOne({
		where: { name: { [Op.iLike]: value.name } },
	});
	if (duplicate) {
		throw ApiError.conflict("Space with the same name already exists");
	}

	const space = await Space.create({ ...value });
	return toPlain(space);
};

const updateSpace = async (payload = {}) => {
	const { isValid, errors, value } = validateUpdateSpace(payload);
	if (!isValid) {
		throw ApiError.badRequest("Invalid update payload", errors);
	}

	const existing = await Space.findByPk(value.id);
	if (!existing) {
		throw ApiError.notFound("Space not found");
	}

	// Case-insensitive duplicate name check (excluding self)
	const duplicate = await Space.findOne({
		where: {
			id: { [Op.ne]: value.id },
			name: { [Op.iLike]: value.name },
		},
	});
	if (duplicate) {
		throw ApiError.conflict("Another space with the same name already exists");
	}

	await existing.update({
		name: value.name,
		type: value.type,
		capacity: value.capacity,
		imageUrl: value.imageUrl,
	});
	return toPlain(existing);
};

const deleteSpace = async (spaceId) => {
	const id = Number(spaceId);
	const space = await Space.findByPk(id);
	if (!space) {
		throw ApiError.notFound("Space not found");
	}

	// Delete all bookings referencing this space (cascade behaviour)
	await Booking.destroy({ where: { spaceId: space.id } });

	await space.destroy();
	return toPlain(space);
};

module.exports = {
	listSpaces,
	getSpaceById,
	createSpace,
	updateSpace,
	deleteSpace,
};
