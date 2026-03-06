const { Sequelize } = require("sequelize");
const bcrypt = require("bcryptjs");
const env = require("./env");
const logger = require("../utils/logger");

// ── Build Sequelize instance ────────────────────────────────────────────────
let sequelize;

if (env.databaseUrl) {
	// Cloud platforms (Render, Railway, Heroku) provide a single connection URL
	sequelize = new Sequelize(env.databaseUrl, {
		dialect: "postgres",
		protocol: "postgres",
		dialectOptions: {
			ssl: {
				require: true,
				rejectUnauthorized: false,
			},
		},
		logging: false,
	});
} else {
	// Local development — individual env vars
	sequelize = new Sequelize(env.pgDatabase, env.pgUser, env.pgPassword, {
		host: env.pgHost,
		port: env.pgPort,
		dialect: "postgres",
		logging: false,
	});
}

// ── Seed helpers ────────────────────────────────────────────────────────────
const SALT_ROUNDS = 10;

const seedDatabase = async () => {
	// Lazy-require models AFTER they've been registered via sequelize instance
	const { User, Space, Booking } = require("../models");

	const spaceCount = await Space.count();
	if (spaceCount > 0) {
		return; // Already seeded
	}

	const defaultPasswordHash = await bcrypt.hash("password123", SALT_ROUNDS);

	await User.bulkCreate([
		{ name: "Event Organizer", email: "organizer@venue.local", password: defaultPasswordHash, role: "admin" },
		{ name: "Faculty User", email: "faculty@venue.local", password: defaultPasswordHash, role: "faculty" },
		{ name: "Student Coordinator", email: "coordinator@venue.local", password: defaultPasswordHash, role: "coordinator" },
	]);

	await Space.bulkCreate([
		{ name: "Bytes Lab", type: "Computer Lab", capacity: 120 },
		{ name: "Vista Hall", type: "Seminar Hall", capacity: 200 },
		{ name: "Classroom SF05", type: "Classroom", capacity: 80 },
		{ name: "Code Studio", type: "Computer Lab", capacity: 250 },
	]);

	// Fetch seeded spaces by name so IDs are always correct regardless of insertion order.
	const seededSpaces = await Space.findAll();

	const spaceByName = Object.fromEntries(seededSpaces.map((space) => [space.name, space]));
	const bytesLab = spaceByName["Bytes Lab"];
	const codeStudio = spaceByName["Code Studio"];
	const vistaHall = spaceByName["Vista Hall"];

	if (!bytesLab || !codeStudio || !vistaHall) {
		throw new Error("Failed to resolve seeded spaces while creating initial bookings");
	}

	await Booking.bulkCreate([
		{
			title: "AI Lab Session",
			type: "Training",
			spaceId: bytesLab.id,
			date: "2026-02-14",
			start: "09:00",
			end: "11:00",
			participants: 35,
			status: "Approved",
			requestedBy: "Dr. Ram Charan",
			requestedRole: "faculty",
			organizedBy: "CSE Department",
			notes: "",
		},
		{
			title: "Robotics Club Meetup",
			type: "Club",
			spaceId: codeStudio.id,
			date: "2026-02-14",
			start: "14:00",
			end: "16:00",
			participants: 24,
			status: "Pending",
			requestedBy: "Mr. Kumar",
			requestedRole: "coordinator",
			organizedBy: "Robotics Club",
			notes: "",
		},
		{
			title: "Faculty Seminar",
			type: "Seminar",
			spaceId: vistaHall.id,
			date: "2026-02-15",
			start: "10:00",
			end: "12:00",
			participants: 90,
			status: "Pending",
			requestedBy: "Prof. Rani",
			requestedRole: "faculty",
			organizedBy: "MBA Department",
			notes: "",
		},
	]);

	logger.info("Database seeded with initial records");
};

// ── Main connect function (called from server.js) ───────────────────────────
const connectDB = async () => {
	try {
		await sequelize.authenticate();
		logger.info("PostgreSQL connected", {
			host: env.databaseUrl ? "via DATABASE_URL" : env.pgHost,
			database: env.pgDatabase,
		});

		try {
			// Preferred path: only create missing tables/indexes, keep existing data.
			await sequelize.sync({ alter: false });
			logger.info("Database tables synced");
		} catch (syncError) {
			if (env.nodeEnv === "production") {
				throw syncError;
			}

			logger.warn("Schema sync failed in development, rebuilding tables", {
				error: syncError.message,
			});

			// Development fallback for legacy/mismatched schemas.
			await sequelize.sync({ force: true });
			logger.info("Database tables recreated");
		}

		await seedDatabase();
	} catch (error) {
		logger.error("PostgreSQL connection failed", error);
		throw error;
	}
};

module.exports = { sequelize, connectDB };
