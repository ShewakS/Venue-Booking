const mongoose = require("mongoose");

const spaceSchema = new mongoose.Schema(
	{
		legacyId: {
			type: Number,
			required: true,
			unique: true,
			index: true,
		},
		name: {
			type: String,
			required: true,
			trim: true,
			maxlength: 100,
			unique: true,
		},
		type: {
			type: String,
			required: true,
			trim: true,
			maxlength: 60,
			index: true,
		},
		capacity: {
			type: Number,
			required: true,
			min: 1,
			max: 5000,
			index: true,
		},
		equipment: {
			type: [String],
			default: [],
		},
	},
	{
		timestamps: true,
		versionKey: false,
	}
);

spaceSchema.set("toJSON", {
	transform: (doc, ret) => {
		ret.id = ret.legacyId;
		delete ret.legacyId;
		delete ret._id;
		return ret;
	},
});

module.exports = mongoose.model("Space", spaceSchema);
