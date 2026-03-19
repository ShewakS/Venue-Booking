const ApiResponse = require("../utils/ApiResponse");
const timetableOverrideService = require("../services/timetable-override.service");

const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

const getOverrides = asyncHandler(async (req, res) => {
	const overrides = await timetableOverrideService.listOverrides(req.query);
	res.status(200).json(new ApiResponse(200, "Timetable overrides fetched successfully", overrides));
});

const createOverride = asyncHandler(async (req, res) => {
	const override = await timetableOverrideService.createOverride(req.body);
	res.status(201).json(new ApiResponse(201, "Timetable override created successfully", override));
});

const deleteOverride = asyncHandler(async (req, res) => {
	const override = await timetableOverrideService.deleteOverride(req.params.id);
	res.status(200).json(new ApiResponse(200, "Timetable override deleted successfully", override));
});

module.exports = {
	getOverrides,
	createOverride,
	deleteOverride,
};
