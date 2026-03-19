const express = require("express");
const authRoutes = require("./auth.routes");
const bookingRoutes = require("./booking.routes");
const spaceRoutes = require("./space.routes");
const userRoutes = require("./user.routes");
const timetableOverrideRoutes = require("./timetable-override.routes");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/bookings", bookingRoutes);
router.use("/spaces", spaceRoutes);
router.use("/users", userRoutes);
router.use("/timetable-overrides", timetableOverrideRoutes);

module.exports = router;
