const ApiResponse = require("../utils/ApiResponse");
const spaceService = require("../services/space.service");

const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

const getSpaces = asyncHandler(async (req, res) => {
	const spaces = await spaceService.listSpaces(req.query);
	res.status(200).json(new ApiResponse(200, "Spaces fetched successfully", spaces));
});

const getSpaceById = asyncHandler(async (req, res) => {
	const space = await spaceService.getSpaceById(req.params.id);
	res.status(200).json(new ApiResponse(200, "Space fetched successfully", space));
});

const createSpace = asyncHandler(async (req, res) => {
	const space = await spaceService.createSpace(req.body);
	res.status(201).json(new ApiResponse(201, "Space created successfully", space));
});

const updateSpace = asyncHandler(async (req, res) => {
	const space = await spaceService.updateSpace({ ...req.body, id: Number(req.params.id) });
	res.status(200).json(new ApiResponse(200, "Space updated successfully", space));
});

const deleteSpace = asyncHandler(async (req, res) => {
	const space = await spaceService.deleteSpace(req.params.id);
	res.status(200).json(new ApiResponse(200, "Space deleted successfully", space));
});

module.exports = {
	getSpaces,
	getSpaceById,
	createSpace,
	updateSpace,
	deleteSpace,
};
