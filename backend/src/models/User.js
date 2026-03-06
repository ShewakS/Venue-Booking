const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const User = sequelize.define(
	"User",
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		name: {
			type: DataTypes.STRING(80),
			allowNull: false,
			validate: {
				notEmpty: true,
				len: [1, 80],
			},
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
			defaultValue: "",
			validate: {
				isEmail: true,
			},
			set(value) {
				this.setDataValue("email", typeof value === "string" ? value.trim().toLowerCase() : value);
			},
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: "",
		},
		role: {
			type: DataTypes.ENUM("admin", "faculty", "coordinator"),
			allowNull: false,
		},
	},
	{
		tableName: "users",
		timestamps: true,
		underscored: true,
	}
);

module.exports = User;
