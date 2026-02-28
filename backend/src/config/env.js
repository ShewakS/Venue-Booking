require("dotenv").config();

const env = {
	nodeEnv: process.env.NODE_ENV || "development",
	port: Number(process.env.PORT) || 5000,
	mongoUri: process.env.MONGO_URI || "mongodb://127.0.0.1:27017/venue_booking",
	jwtSecret: process.env.JWT_SECRET || "venue-booking-dev-secret",
	jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
	corsOrigin: process.env.CORS_ORIGIN || "http://localhost:3000",
};

module.exports = env;
