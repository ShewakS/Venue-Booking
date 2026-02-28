const ApiResponse = require("../utils/ApiResponse");
const userService = require("../services/user.service");

const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

const getUsers = asyncHandler(async (req, res) => {
	const users = await userService.listUsers(req.query);
	res.status(200).json(new ApiResponse(200, "Users fetched successfully", users));
});

const getUserById = asyncHandler(async (req, res) => {
	const user = await userService.getUserById(req.params.id);
	res.status(200).json(new ApiResponse(200, "User fetched successfully", user));
});

const updateUser = asyncHandler(async (req, res) => {
	const user = await userService.updateUser(req.params.id, req.body);
	res.status(200).json(new ApiResponse(200, "User updated successfully", user));
});

const deleteUser = asyncHandler(async (req, res) => {
	const user = await userService.deleteUser(req.params.id);
	res.status(200).json(new ApiResponse(200, "User deleted successfully", user));
});

module.exports = {
	getUsers,
	getUserById,
	updateUser,
	deleteUser,
};
