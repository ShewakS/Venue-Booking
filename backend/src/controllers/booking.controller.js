const ApiResponse = require("../utils/ApiResponse");
const bookingService = require("../services/booking.service");
const PDFDocument = require("pdfkit");

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

const getBookingReport = asyncHandler(async (req, res) => {
	const report = await bookingService.getReport(req.query);
	res.status(200).json(new ApiResponse(200, "Booking report generated successfully", report));
});

const downloadBookingReportPdf = asyncHandler(async (req, res) => {
	const report = await bookingService.getReport(req.query);
	const monthLabel = report.month ? String(report.month).padStart(2, "0") : "all";
	const fileName = `booking-report-${report.scope}-${report.year}-${monthLabel}.pdf`;

	res.setHeader("Content-Type", "application/pdf");
	res.setHeader("Content-Disposition", `attachment; filename=\"${fileName}\"`);

	const doc = new PDFDocument({ margin: 36, size: "A4" });
	doc.pipe(res);

	doc.fontSize(18).text("Venue Booking Report", { align: "left" });
	doc.moveDown(0.4);
	doc.fontSize(11).text(`Scope: ${report.scope.toUpperCase()}`);
	doc.fontSize(11).text(`Year: ${report.year}${report.month ? ` | Month: ${String(report.month).padStart(2, "0")}` : ""}`);
	doc.fontSize(11).text(`Range: ${report.fromDate} to ${report.toDate}`);
	doc.moveDown(0.4);
	doc.fontSize(11).text(
		`Total: ${report.totals.total} | Approved: ${report.totals.approved} | Pending: ${report.totals.pending} | Rejected: ${report.totals.rejected}`
	);
	doc.moveDown(0.8);

	if (!report.bookings.length) {
		doc.fontSize(11).text("No bookings found for selected period.");
		doc.end();
		return;
	}

	report.bookings.forEach((booking, index) => {
		const line = `${index + 1}. ${booking.date} ${booking.start}-${booking.end} | ${booking.title} | ${booking.spaceName} | ${booking.status}`;
		doc.fontSize(10).text(line);
		if (booking.requestedBy) {
			doc.fontSize(9).fillColor("#555555").text(`Requested by: ${booking.requestedBy}`).fillColor("#000000");
		}
		doc.moveDown(0.3);
	});

	doc.end();
});

module.exports = {
	getBookings,
	getBookingById,
	createBooking,
	updateBookingStatus,
	deleteBooking,
	getBookingReport,
	downloadBookingReportPdf,
};
