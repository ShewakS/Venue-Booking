const express = require("express");
const cors = require("cors");
const env = require("./config/env");
const routes = require("./routes");
const ApiError = require("./utils/ApiError");
const { errorHandler } = require("./middlewares/error.middleware");

const app = express();

const corsOptions = {
	origin(origin, callback) {
		// Allow non-browser requests (curl, health checks) without Origin header.
		if (!origin) {
			callback(null, true);
			return;
		}

		if (env.corsOrigins.includes(origin)) {
			callback(null, true);
			return;
		}

		callback(new Error("Not allowed by CORS"));
	},
	credentials: true,
};

app.use(
	cors(corsOptions)
);
app.use(express.json({ limit: "6mb" }));
app.use(express.urlencoded({ extended: true, limit: "6mb" }));

app.get("/health", (req, res) => {
	res.status(200).json({ success: true, message: "Backend is healthy" });
});

app.get("/", (req, res) => {
	res.status(200).json({
		success: true,
		message: "Venue Booking API is running",
	});
});

app.use("/api", routes);

app.use((req, res, next) => {
	next(ApiError.notFound("Route not found"));
});

app.use(errorHandler);

module.exports = app;
