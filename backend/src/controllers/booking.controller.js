const ApiResponse = require("../utils/ApiResponse");
const bookingService = require("../services/booking.service");

const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

const getBookings = asyncHandler(async (req, res) => {
	const bookings = await bookingService.listBookings(req.query);
	res.status(200).json(new ApiResponse(200, "Bookings fetched successfully", bookings));
});

const getBookingById = asyncHandler(async (req, res) => {
	const booking = await bookingService.getBookingById(req.params.id);
	res.status(200).json(new ApiResponse(200, "Booking fetched successfully", booking));
});

const createBooking = asyncHandler(async (req, res) => {
	const booking = await bookingService.createBooking(req.body);
	res.status(201).json(new ApiResponse(201, "Booking created successfully", booking));
});

const updateBookingStatus = asyncHandler(async (req, res) => {
	const booking = await bookingService.updateBookingStatus(req.params.id, req.body);
	res.status(200).json(new ApiResponse(200, "Booking status updated successfully", booking));
});

const deleteBooking = asyncHandler(async (req, res) => {
	const booking = await bookingService.deleteBooking(req.params.id);
	res.status(200).json(new ApiResponse(200, "Booking deleted successfully", booking));
});

module.exports = {
	getBookings,
	getBookingById,
	createBooking,
	updateBookingStatus,
	deleteBooking,
};
