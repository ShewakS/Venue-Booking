const express = require("express");
const cors = require("cors");
const env = require("./config/env");
const routes = require("./routes");
const ApiError = require("./utils/ApiError");
const { errorHandler } = require("./middlewares/error.middleware");

const app = express();

app.use(
	cors({
		origin: env.corsOrigin,
		credentials: true,
	})
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (req, res) => {
	res.status(200).json({ success: true, message: "Backend is healthy" });
});

app.use("/api", routes);

app.use((req, res, next) => {
	next(ApiError.notFound("Route not found"));
});

app.use(errorHandler);

module.exports = app;
