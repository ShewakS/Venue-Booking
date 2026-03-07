const { Sequelize } = require("sequelize");
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

// ── Main connect function (called from server.js) ───────────────────────────
const connectDB = async () => {
	try {
		await sequelize.authenticate();
		logger.info("PostgreSQL connected", {
			host: env.databaseUrl ? "via DATABASE_URL" : env.pgHost,
			database: env.pgDatabase,
		});

		// Sync only creates missing tables/columns according to model metadata.
		// No mock/seed data is inserted automatically.
		await sequelize.sync({ alter: false });
		logger.info("Database tables synced");
	} catch (error) {
		logger.error("PostgreSQL connection failed", error);
		throw error;
	}
};

module.exports = { sequelize, connectDB };
