const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Space = sequelize.define(
	"Space",
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		name: {
			type: DataTypes.STRING(100),
			allowNull: false,
			unique: true,
			validate: {
				notEmpty: true,
				len: [1, 100],
			},
			set(value) {
				this.setDataValue("name", typeof value === "string" ? value.trim() : value);
			},
		},
		type: {
			type: DataTypes.STRING(60),
			allowNull: false,
			validate: {
				notEmpty: true,
			},
			set(value) {
				this.setDataValue("type", typeof value === "string" ? value.trim() : value);
			},
		},
		capacity: {
			type: DataTypes.INTEGER,
			allowNull: false,
			validate: {
				min: 1,
				max: 5000,
			},
		},
	},
	{
		tableName: "spaces",
		timestamps: true,
		underscored: true,
	}
);

module.exports = Space;
