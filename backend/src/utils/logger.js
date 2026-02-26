const LOG_LEVELS = {
	error: 0,
	warn: 1,
	info: 2,
	debug: 3,
};

const environment = process.env.NODE_ENV || "development";
const currentLevel = process.env.LOG_LEVEL || (environment === "production" ? "info" : "debug");

const shouldLog = (level) => {
	const selectedLevel = LOG_LEVELS[currentLevel] ?? LOG_LEVELS.debug;
	const incomingLevel = LOG_LEVELS[level] ?? LOG_LEVELS.info;
	return incomingLevel <= selectedLevel;
};

const serializeError = (error) => {
	if (!error) {
		return undefined;
	}

	return {
		name: error.name,
		message: error.message,
		stack: environment === "production" ? undefined : error.stack,
		...(error.statusCode ? { statusCode: error.statusCode } : {}),
	};
};

const formatMessage = (level, message, meta) => {
	const logEntry = {
		timestamp: new Date().toISOString(),
		level,
		message,
		...(meta ? { meta } : {}),
	};

	return JSON.stringify(logEntry);
};

const write = (level, message, meta = undefined) => {
	if (!shouldLog(level)) {
		return;
	}

	const output = formatMessage(level, message, meta);

	if (level === "error") {
		console.error(output);
		return;
	}

	if (level === "warn") {
		console.warn(output);
		return;
	}

	console.log(output);
};

const logger = {
	error(message, error = null, meta = {}) {
		write("error", message, {
			...meta,
			...(error ? { error: serializeError(error) } : {}),
		});
	},

	warn(message, meta = {}) {
		write("warn", message, meta);
	},

	info(message, meta = {}) {
		write("info", message, meta);
	},

	debug(message, meta = {}) {
		write("debug", message, meta);
	},

	http(req, res, durationMs) {
		write("info", "HTTP request", {
			method: req.method,
			url: req.originalUrl || req.url,
			statusCode: res.statusCode,
			durationMs,
			ip: req.ip,
			userAgent: req.get ? req.get("user-agent") : undefined,
		});
	},
};

module.exports = logger;
