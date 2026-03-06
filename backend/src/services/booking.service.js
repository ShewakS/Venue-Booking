const { Op } = require("sequelize");
const ApiError = require("../utils/ApiError");
const { Booking, Space } = require("../models");
const {
	validateCreateBooking,
	validateBookingQuery,
	validateBookingStatusUpdate,
} = require("../validators/booking.validator");

// ── Helpers ──────────────────────────────────────────────────────────────────
const hasOverlap = (startA, endA, startB, endB) => startA < endB && startB < endA;

const toPlain = (instance) => {
	if (!instance) return null;
	return instance.get ? instance.get({ plain: true }) : { ...instance };
};

// ── Service methods ──────────────────────────────────────────────────────────
const listBookings = async (query = {}) => {
	const { isValid, errors, value } = validateBookingQuery(query);
	if (!isValid) {
		throw ApiError.badRequest("Invalid booking query", errors);
	}

	const where = {};

	if (value.spaceId !== undefined) {
		where.spaceId = value.spaceId;
	}

	if (value.status) {
		where.status = value.status;
	}

	if (value.date) {
		where.date = value.date;
	}

	const bookings = await Booking.findAll({
		where,
		order: [["id", "DESC"]],
	});

	return bookings.map(toPlain);
};

const getBookingById = async (bookingId) => {
	const id = Number(bookingId);
	const booking = await Booking.findByPk(id);

	if (!booking) {
		throw ApiError.notFound("Booking not found");
	}

	return toPlain(booking);
};

const createBooking = async (payload = {}) => {
	const { isValid, errors, value } = validateCreateBooking(payload);
	if (!isValid) {
		throw ApiError.badRequest("Invalid booking payload", errors);
	}

	const space = await Space.findByPk(value.spaceId);
	if (!space) {
		throw ApiError.notFound("Space not found");
	}

	if (value.participants > space.capacity) {
		throw ApiError.badRequest("Participant count exceeds selected space capacity");
	}

	// Fetch same-day bookings for this space (excluding Rejected)
	const sameDayBookings = await Booking.findAll({
		where: {
			spaceId: value.spaceId,
			date: value.date,
			status: { [Op.ne]: "Rejected" },
		},
	});

	const conflict = sameDayBookings.find((booking) =>
		hasOverlap(value.start, value.end, booking.start, booking.end)
	);

	if (conflict) {
		throw ApiError.conflict("Selected time overlaps with an existing booking");
	}

	const booking = await Booking.create({ ...value });
	return toPlain(booking);
};

const updateBookingStatus = async (bookingId, payload = {}) => {
	const id = Number(bookingId);
	const existing = await Booking.findByPk(id);
	if (!existing) {
		throw ApiError.notFound("Booking not found");
	}

	const { isValid, errors, value } = validateBookingStatusUpdate(payload);
	if (!isValid) {
		throw ApiError.badRequest("Invalid status payload", errors);
	}

	await existing.update({ status: value.status });
	return toPlain(existing);
};

const deleteBooking = async (bookingId) => {
	const id = Number(bookingId);
	const booking = await Booking.findByPk(id);

	if (!booking) {
		throw ApiError.notFound("Booking not found");
	}

	await booking.destroy();
	return toPlain(booking);
};

module.exports = {
	listBookings,
	getBookingById,
	createBooking,
	updateBookingStatus,
	deleteBooking,
};
