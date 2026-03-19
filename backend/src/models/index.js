/**
 * Central model registry.
 * All Sequelize models are imported here so that:
 *   1. They register themselves with the shared `sequelize` instance.
 *   2. The rest of the app (services, db.js seeder) can import from one place.
 */
const User = require("./User");
const Space = require("./Space");
const Booking = require("./Booking");
const TimetableOverride = require("./TimetableOverride");

module.exports = { User, Space, Booking, TimetableOverride };
