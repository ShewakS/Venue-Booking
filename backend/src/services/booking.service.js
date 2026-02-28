const ApiError = require("../utils/ApiError");
const Booking = require("../models/Booking");
const Space = require("../models/Space");
const {
	validateCreateBooking,
	validateBookingQuery,
	validateBookingStatusUpdate,
} = require("../validators/booking.validator");

const hasOverlap = (startA, endA, startB, endB) => startA < endB && startB < endA;

const getNextBookingLegacyId = async () => {
	const latest = await Booking.findOne().sort({ legacyId: -1 }).select("legacyId").lean();
	return latest?.legacyId ? latest.legacyId + 1 : 101;
};

const listBookings = async (query = {}) => {
	const { isValid, errors, value } = validateBookingQuery(query);
	if (!isValid) {
		throw ApiError.badRequest("Invalid booking query", errors);
	}

	const mongoQuery = {};

	if (value.spaceId !== undefined) {
		mongoQuery.spaceId = value.spaceId;
	}

	if (value.status) {
		mongoQuery.status = value.status;
	}

	if (value.date) {
		mongoQuery.date = value.date;
	}

	return Booking.find(mongoQuery).sort({ legacyId: -1 });
};

const getBookingById = async (bookingId) => {
	const id = Number(bookingId);
	const booking = await Booking.findOne({ legacyId: id });

	if (!booking) {
		throw ApiError.notFound("Booking not found");
	}

	return booking;
};

const createBooking = async (payload = {}) => {
	const { isValid, errors, value } = validateCreateBooking(payload);
	if (!isValid) {
		throw ApiError.badRequest("Invalid booking payload", errors);
	}

	const space = await Space.findOne({ legacyId: value.spaceId });
	if (!space) {
		throw ApiError.notFound("Space not found");
	}

	if (value.participants > space.capacity) {
		throw ApiError.badRequest("Participant count exceeds selected space capacity");
	}

	const sameDayBookings = await Booking.find({
		spaceId: value.spaceId,
		date: value.date,
		status: { $ne: "Rejected" },
	});

	const conflict = sameDayBookings.find((booking) => {
		if (booking.status === "Rejected") {
			return false;
		}

		return (
			booking.spaceId === value.spaceId &&
			booking.date === value.date &&
			hasOverlap(value.start, value.end, booking.start, booking.end)
		);
	});

	if (conflict) {
		throw ApiError.conflict("Selected time overlaps with an existing booking");
	}

	const legacyId = await getNextBookingLegacyId();
	return Booking.create({ ...value, legacyId, spaceId: space.legacyId });
};

const updateBookingStatus = async (bookingId, payload = {}) => {
	const id = Number(bookingId);
	const existing = await Booking.findOne({ legacyId: id });
	if (!existing) {
		throw ApiError.notFound("Booking not found");
	}

	const { isValid, errors, value } = validateBookingStatusUpdate(payload);
	if (!isValid) {
		throw ApiError.badRequest("Invalid status payload", errors);
	}

	const updatedBooking = await Booking.findByIdAndUpdate(
		existing._id,
		{ status: value.status },
		{ new: true, runValidators: true }
	);

	return updatedBooking;
};

const deleteBooking = async (bookingId) => {
	const id = Number(bookingId);
	const removed = await Booking.findOneAndDelete({ legacyId: id });

	if (!removed) {
		throw ApiError.notFound("Booking not found");
	}

	return removed;
};

module.exports = {
	listBookings,
	getBookingById,
	createBooking,
	updateBookingStatus,
	deleteBooking,
};

