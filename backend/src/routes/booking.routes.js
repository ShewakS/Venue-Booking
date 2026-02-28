const express = require("express");
const bookingController = require("../controllers/booking.controller");

const router = express.Router();

router.get("/", bookingController.getBookings);
router.get("/:id", bookingController.getBookingById);
router.post("/", bookingController.createBooking);
router.patch("/:id/status", bookingController.updateBookingStatus);
router.delete("/:id", bookingController.deleteBooking);

module.exports = router;
