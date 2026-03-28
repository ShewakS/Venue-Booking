const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Booking = sequelize.define(
	"Booking",
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		title: {
			type: DataTypes.STRING(120),
			allowNull: false,
			validate: {
				notEmpty: true,
				len: [1, 120],
			},
		},
		type: {
			type: DataTypes.ENUM("Seminar", "Club", "Workshop", "Hackathon", "Training"),
			allowNull: false,
		},
		// Foreign key referencing spaces.id (no FK constraint enforced at DB level
		// to stay consistent with the original loose-reference design)
		spaceId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			field: "space_id",
		},
		date: {
			type: DataTypes.DATEONLY, // stores as YYYY-MM-DD string (no time)
			allowNull: false,
			validate: {
				isDate: true,
			},
			get() {
				const raw = this.getDataValue("date");
				// DATEONLY from Sequelize may return a Date object; return as string
				if (!raw) return raw;
				if (raw instanceof Date) {
					return raw.toISOString().slice(0, 10);
				}
				return raw;
			},
		},
		start: {
			type: DataTypes.STRING(5),
			allowNull: false,
			validate: {
				is: /^([01]\d|2[0-3]):([0-5]\d)$/,
			},
		},
		end: {
			type: DataTypes.STRING(5),
			allowNull: false,
			validate: {
				is: /^([01]\d|2[0-3]):([0-5]\d)$/,
			},
		},
		participants: {
			type: DataTypes.INTEGER,
			allowNull: false,
			validate: {
				min: 1,
			},
		},
		organizedBy: {
			type: DataTypes.STRING(100),
			defaultValue: "",
			field: "organized_by",
		},
		notes: {
			type: DataTypes.TEXT,
			defaultValue: "",
		},
		requestedBy: {
			type: DataTypes.STRING(80),
			defaultValue: "Campus User",
			field: "requested_by",
		},
		requestedPhone: {
			type: DataTypes.STRING(20),
			defaultValue: "",
			field: "requested_phone",
		},
		requestedRole: {
			type: DataTypes.ENUM("admin", "faculty", "student", "coordinator", ""),
			defaultValue: "",
			field: "requested_role",
		},
		status: {
			type: DataTypes.ENUM("Pending", "Approved", "Rejected"),
			defaultValue: "Pending",
		},
	},
	{
		tableName: "bookings",
		timestamps: true,
		underscored: true,
		indexes: [
			{ fields: ["space_id", "date", "start", "end"] },
			{ fields: ["space_id"] },
			{ fields: ["date"] },
			{ fields: ["status"] },
		],
	}
);

module.exports = Booking;
