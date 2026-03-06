require("dotenv").config();

const env = {
	nodeEnv: process.env.NODE_ENV || "development",
	port: Number(process.env.PORT) || 5000,
	// PostgreSQL — use DATABASE_URL (cloud) or individual vars (local)
	databaseUrl: process.env.DATABASE_URL || null,
	pgHost: process.env.PG_HOST || "localhost",
	pgPort: Number(process.env.PG_PORT) || 5432,
	pgDatabase: process.env.PG_DATABASE || "venue_booking",
	pgUser: process.env.PG_USER || "postgres",
	pgPassword: process.env.PG_PASSWORD || null,
	jwtSecret: process.env.JWT_SECRET || "venue-booking-dev-secret",
	jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
	corsOrigin: process.env.CORS_ORIGIN || "http://localhost:3000",
};

module.exports = env;
