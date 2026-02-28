const app = require("./src/app");
const connectDB = require("./src/config/db");
const env = require("./src/config/env");
const logger = require("./src/utils/logger");

const startListening = (port, retriesLeft = 10) => {
	const server = app.listen(port, () => {
		logger.info(`Server running on port ${port}`);
	});

	server.on("error", (error) => {
		if (error.code === "EADDRINUSE" && retriesLeft > 0) {
			const nextPort = port + 1;
			logger.warn(`Port ${port} is already in use. Retrying on port ${nextPort}.`);
			startListening(nextPort, retriesLeft - 1);
			return;
		}

		logger.error("Failed to start server", error, { port });
		process.exit(1);
	});
};

const startServer = async () => {
	try {
		await connectDB();
		startListening(env.port);
	} catch (error) {
		logger.error("Failed to start server", error);
		process.exit(1);
	}
};

startServer();
