class ApiResponse {
	constructor(statusCode = 200, message = "Success", data = null, meta = null) {
		this.statusCode = statusCode;
		this.success = statusCode < 400;
		this.message = message;

		if (data !== null && data !== undefined) {
			this.data = data;
		}

		if (meta !== null && meta !== undefined) {
			this.meta = meta;
		}

		this.timestamp = new Date().toISOString();
	}

	static ok(data = null, message = "Success", meta = null) {
		return new ApiResponse(200, message, data, meta);
	}

	static created(data = null, message = "Created", meta = null) {
		return new ApiResponse(201, message, data, meta);
	}

	static accepted(data = null, message = "Accepted", meta = null) {
		return new ApiResponse(202, message, data, meta);
	}

	static noContent(message = "No content") {
		return new ApiResponse(204, message);
	}

	static custom(statusCode, message = "Success", data = null, meta = null) {
		return new ApiResponse(statusCode, message, data, meta);
	}

	toJSON() {
		return {
			success: this.success,
			message: this.message,
			...(this.data !== undefined ? { data: this.data } : {}),
			...(this.meta !== undefined ? { meta: this.meta } : {}),
			timestamp: this.timestamp,
		};
	}
}

module.exports = ApiResponse;
