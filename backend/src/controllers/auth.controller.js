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

module.exports = {
	login,
	register,
	me,
};
