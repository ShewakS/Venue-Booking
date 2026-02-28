const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
	{
		legacyId: {
			type: Number,
			required: true,
			unique: true,
			index: true,
		},
		title: {
			type: String,
			required: true,
			trim: true,
			maxlength: 120,
		},
		type: {
			type: String,
			enum: ["Seminar", "Lab", "Club", "Workshop", "Lecture"],
			required: true,
			index: true,
		},
		spaceId: {
			type: Number,
			required: true,
			index: true,
		},
		date: {
			type: String,
			required: true,
			match: /^\d{4}-\d{2}-\d{2}$/,
			index: true,
		},
		start: {
			type: String,
			required: true,
			match: /^([01]\d|2[0-3]):([0-5]\d)$/,
		},
		end: {
			type: String,
			required: true,
			match: /^([01]\d|2[0-3]):([0-5]\d)$/,
		},
		participants: {
			type: Number,
			required: true,
			min: 1,
		},
		organizedBy: {
			type: String,
			trim: true,
			default: "",
			maxlength: 100,
		},
		notes: {
			type: String,
			trim: true,
			default: "",
			maxlength: 1000,
		},
		requestedBy: {
			type: String,
			trim: true,
			default: "Campus User",
			maxlength: 80,
		},
		requestedRole: {
			type: String,
			enum: ["admin", "faculty", "coordinator", ""],
			default: "",
			index: true,
		},
		status: {
			type: String,
			enum: ["Pending", "Approved", "Rejected"],
			default: "Pending",
			index: true,
		},
	},
	{
		timestamps: true,
		versionKey: false,
	}
);

bookingSchema.index({ spaceId: 1, date: 1, start: 1, end: 1 });

bookingSchema.set("toJSON", {
	transform: (doc, ret) => {
		ret.id = ret.legacyId;
		delete ret.legacyId;
		delete ret._id;
		return ret;
	},
});

module.exports = mongoose.model("Booking", bookingSchema);
