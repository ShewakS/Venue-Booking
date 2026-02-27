const ApiError = require("../utils/ApiError");
const {
	validateCreateBooking,
	validateBookingQuery,
	validateBookingStatusUpdate,
} = require("../validators/booking.validator");
const { dataStore, nextId } = require("./store");

const hasOverlap = (startA, endA, startB, endB) => startA < endB && startB < endA;

const listBookings = (query = {}) => {
	const { isValid, errors, value } = validateBookingQuery(query);
	if (!isValid) {
		throw ApiError.badRequest("Invalid booking query", errors);
	}

	return dataStore.bookings.filter((booking) => {
		if (value.spaceId !== undefined && booking.spaceId !== value.spaceId) {
			return false;
		}

		if (value.status && booking.status !== value.status) {
			return false;
		}

		if (value.date && booking.date !== value.date) {
			return false;
		}

		return true;
	});
};

const getBookingById = (bookingId) => {
	const id = Number(bookingId);
	const booking = dataStore.bookings.find((item) => item.id === id);

	if (!booking) {
		throw ApiError.notFound("Booking not found");
	}

	return booking;
};

const createBooking = (payload = {}) => {
	const { isValid, errors, value } = validateCreateBooking(payload);
	if (!isValid) {
		throw ApiError.badRequest("Invalid booking payload", errors);
	}

	const space = dataStore.spaces.find((item) => item.id === value.spaceId);
	if (!space) {
		throw ApiError.notFound("Space not found");
	}

	if (value.participants > space.capacity) {
		throw ApiError.badRequest("Participant count exceeds selected space capacity");
	}

	const conflict = dataStore.bookings.find((booking) => {
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

	const booking = {
		id: nextId("booking"),
		...value,
		createdAt: new Date().toISOString(),
	};

	dataStore.bookings.push(booking);
	return booking;
};

const updateBookingStatus = (bookingId, payload = {}) => {
	const id = Number(bookingId);
	const bookingIndex = dataStore.bookings.findIndex((booking) => booking.id === id);

	if (bookingIndex === -1) {
		throw ApiError.notFound("Booking not found");
	}

	const { isValid, errors, value } = validateBookingStatusUpdate(payload);
	if (!isValid) {
		throw ApiError.badRequest("Invalid status payload", errors);
	}

	const updatedBooking = {
		...dataStore.bookings[bookingIndex],
		status: value.status,
		updatedAt: new Date().toISOString(),
	};

	dataStore.bookings[bookingIndex] = updatedBooking;
	return updatedBooking;
};

const deleteBooking = (bookingId) => {
	const id = Number(bookingId);
	const bookingIndex = dataStore.bookings.findIndex((booking) => booking.id === id);

	if (bookingIndex === -1) {
		throw ApiError.notFound("Booking not found");
	}

	const [removed] = dataStore.bookings.splice(bookingIndex, 1);
	return removed;
};

module.exports = {
	listBookings,
	getBookingById,
	createBooking,
	updateBookingStatus,
	deleteBooking,
};

