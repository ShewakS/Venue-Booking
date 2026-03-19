const ApiError = require("../utils/ApiError");
const { TimetableOverride } = require("../models");

const toPlain = (instance) => {
	if (!instance) return null;
	return instance.get ? instance.get({ plain: true }) : { ...instance };
};

const validateOverride = (payload = {}) => {
	const errors = [];

	const spaceId = Number(payload.spaceId);
	const date = typeof payload.date === "string" ? payload.date.trim() : "";
	const start = typeof payload.start === "string" ? payload.start.trim() : "";
	const end = typeof payload.end === "string" ? payload.end.trim() : "";
	const status = typeof payload.status === "string" ? payload.status.trim() : "";

	if (!Number.isInteger(spaceId) || spaceId <= 0) {
		errors.push("spaceId must be a positive integer");
	}

	if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
		errors.push("date must be a valid YYYY-MM-DD format");
	}

	if (!start || !/^([01]\d|2[0-3]):([0-5]\d)$/.test(start)) {
		errors.push("start must be a valid HH:MM format");
	}

	if (!end || !/^([01]\d|2[0-3]):([0-5]\d)$/.test(end)) {
		errors.push("end must be a valid HH:MM format");
	}

	if (start && end && start >= end) {
		errors.push("start time must be before end time");
	}

	if (!["academic", "available"].includes(status)) {
		errors.push("status must be either 'academic' or 'available'");
	}

	return {
		isValid: errors.length === 0,
		errors,
		value: { spaceId, date, start, end, status },
	};
};

const listOverrides = async (query = {}) => {
	const spaceId = query.spaceId ? Number(query.spaceId) : undefined;
	const date = typeof query.date === "string" ? query.date.trim() : undefined;
	const status = typeof query.status === "string" ? query.status.trim() : undefined;

	const where = {};

	if (spaceId) {
		where.spaceId = spaceId;
	}

	if (date) {
		where.date = date;
	}

	if (["academic", "available"].includes(status)) {
		where.status = status;
	}

	const overrides = await TimetableOverride.findAll({
		where,
		order: [["date", "ASC"], ["start", "ASC"]],
	});

	return overrides.map(toPlain);
};

const createOverride = async (payload = {}) => {
	const { isValid, errors, value } = validateOverride(payload);

	if (!isValid) {
		throw ApiError.badRequest("Invalid override payload", errors);
	}

	const override = await TimetableOverride.create(value);
	return toPlain(override);
};

const deleteOverride = async (overrideId) => {
	const id = Number(overrideId);
	const override = await TimetableOverride.findByPk(id);

	if (!override) {
		throw ApiError.notFound("Timetable override not found");
	}

	await override.destroy();
	return toPlain(override);
};

module.exports = {
	listOverrides,
	createOverride,
	deleteOverride,
};
