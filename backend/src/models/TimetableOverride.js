const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const TimetableOverride = sequelize.define(
	"TimetableOverride",
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		spaceId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			field: "space_id",
		},
		date: {
			type: DataTypes.DATEONLY,
			allowNull: false,
			validate: {
				isDate: true,
			},
			get() {
				const raw = this.getDataValue("date");
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
		status: {
			type: DataTypes.ENUM("academic", "available"),
			allowNull: false,
			defaultValue: "available",
		},
	},
	{
		tableName: "timetable_overrides",
		timestamps: true,
		underscored: true,
		indexes: [
			{ fields: ["space_id", "date"] },
			{ fields: ["space_id"] },
			{ fields: ["date"] },
			{ fields: ["status"] },
		],
	}
);

module.exports = TimetableOverride;
