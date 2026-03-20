const ApiResponse = require("../utils/ApiResponse");
const authService = require("../services/auth.service");

const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

const login = asyncHandler(async (req, res) => {
	const result = await authService.login(req.body);
	res.status(200).json(new ApiResponse(200, "Login successful", result));
});

const register = asyncHandler(async (req, res) => {
	const result = await authService.register(req.body);
	res.status(201).json(new ApiResponse(201, "Registration successful", result));
});

const me = asyncHandler(async (req, res) => {
	res.status(200).json(new ApiResponse(200, "Current user fetched", req.user));
});

const getPendingUsers = asyncHandler(async (req, res) => {
	const users = await authService.getPendingUsers();
	res.status(200).json(new ApiResponse(200, "Pending users fetched", users));
});

const approveUser = asyncHandler(async (req, res) => {
	const { userId } = req.params;
	const user = await authService.approveUser(userId);
	res.status(200).json(new ApiResponse(200, "User approved successfully", user));
});

const rejectUser = asyncHandler(async (req, res) => {
	const { userId } = req.params;
	const result = await authService.rejectUser(userId);
	res.status(200).json(new ApiResponse(200, result.message, null));
});

module.exports = {
	login,
	register,
	me,
	getPendingUsers,
	approveUser,
	rejectUser,
};
