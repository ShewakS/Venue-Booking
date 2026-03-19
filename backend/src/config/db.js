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

		const queryInterface = sequelize.getQueryInterface();
		const spaceTable = await queryInterface.describeTable("spaces");

		if (!spaceTable.image_url) {
			await queryInterface.addColumn("spaces", "image_url", {
				type: Sequelize.TEXT,
				allowNull: true,
			});
			logger.info("Added spaces.image_url column");
		}

		const bookingTable = await queryInterface.describeTable("bookings");

		if (!bookingTable.created_at) {
			await queryInterface.addColumn("bookings", "created_at", {
				type: Sequelize.DATE,
				allowNull: false,
				defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
			});
			logger.info("Added bookings.created_at column");
		}

		if (!bookingTable.updated_at) {
			await queryInterface.addColumn("bookings", "updated_at", {
				type: Sequelize.DATE,
				allowNull: false,
				defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
			});
			logger.info("Added bookings.updated_at column");
		}

		// Ensure timetable_overrides table exists
		const tableList = await queryInterface.showAllTables();
		if (!tableList.includes("timetable_overrides")) {
			await queryInterface.createTable("timetable_overrides", {
				id: {
					type: Sequelize.INTEGER,
					primaryKey: true,
					autoIncrement: true,
				},
				space_id: {
					type: Sequelize.INTEGER,
					allowNull: false,
				},
				date: {
					type: Sequelize.DATEONLY,
					allowNull: false,
				},
				start: {
					type: Sequelize.STRING(5),
					allowNull: false,
				},
				end: {
					type: Sequelize.STRING(5),
					allowNull: false,
				},
				status: {
					type: Sequelize.ENUM("academic", "available"),
					allowNull: false,
					defaultValue: "available",
				},
				created_at: {
					type: Sequelize.DATE,
					allowNull: false,
					defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
				},
				updated_at: {
					type: Sequelize.DATE,
					allowNull: false,
					defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
				},
			});
			await queryInterface.addIndex("timetable_overrides", ["space_id", "date"]);
			await queryInterface.addIndex("timetable_overrides", ["space_id"]);
			await queryInterface.addIndex("timetable_overrides", ["date"]);
			await queryInterface.addIndex("timetable_overrides", ["status"]);
			logger.info("Created timetable_overrides table");
		}

		logger.info("Database tables synced");
	} catch (error) {
		logger.error("PostgreSQL connection failed", error);
		throw error;
	}
};

module.exports = { sequelize, connectDB };
