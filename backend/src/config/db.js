const mongoose = require("mongoose");
const env = require("./env");
const logger = require("../utils/logger");
const User = require("../models/User");
const Space = require("../models/Space");
const Booking = require("../models/Booking");

const seedDatabase = async () => {
	const spaceCount = await Space.countDocuments();
	if (spaceCount > 0) {
		return;
	}

	await User.insertMany([
		{ name: "Event Organizer", email: "organizer@venue.local", password: "password123", role: "admin" },
		{ name: "Faculty User", email: "faculty@venue.local", password: "password123", role: "faculty" },
		{
			name: "Student Coordinator",
			email: "coordinator@venue.local",
			password: "password123",
			role: "coordinator",
		},
	]);

	await Space.insertMany([
		{ legacyId: 1, name: "Bytes Lab", type: "Computer Lab", capacity: 120, equipment: [] },
		{ legacyId: 2, name: "Vista Hall", type: "Seminar Hall", capacity: 200, equipment: [] },
		{ legacyId: 3, name: "Classroom SF05", type: "Classroom", capacity: 80, equipment: [] },
		{ legacyId: 4, name: "Code Studio", type: "Computer Lab", capacity: 250, equipment: [] },
	]);

	await Booking.insertMany([
		{
			legacyId: 101,
			title: "AI Lab Session",
			type: "Lab",
			spaceId: 1,
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
			legacyId: 102,
			title: "Robotics Club Meetup",
			type: "Club",
			spaceId: 4,
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
			legacyId: 103,
			title: "Faculty Seminar",
			type: "Seminar",
			spaceId: 2,
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

const connectDB = async () => {
	try {
		await mongoose.connect(env.mongoUri, {
			autoIndex: true,
		});

		logger.info("MongoDB connected", {
			host: mongoose.connection.host,
			name: mongoose.connection.name,
		});

		await seedDatabase();
	} catch (error) {
		logger.error("MongoDB connection failed", error);
		throw error;
	}
};

module.exports = connectDB;
