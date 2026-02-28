const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
			maxlength: 80,
		},
		email: {
			type: String,
			trim: true,
			lowercase: true,
			default: "",
			index: true,
		},
		password: {
			type: String,
			default: "",
		},
		role: {
			type: String,
			enum: ["admin", "faculty", "coordinator"],
			required: true,
			index: true,
		},
	},
	{
		timestamps: true,
		versionKey: false,
	}
);

module.exports = mongoose.model("User", userSchema);
