const USER_ROLES = ["admin", "faculty", "coordinator"];

const asString = (value) => (typeof value === "string" ? value.trim() : "");

const isNonEmptyString = (value) => typeof value === "string" && value.trim().length > 0;

const validateLogin = (payload = {}) => {
	const errors = [];

	const name = asString(payload.name);
	const role = asString(payload.role).toLowerCase();

	if (name && name.length > 80) {
		errors.push("name must be at most 80 characters long");
	}

	if (!isNonEmptyString(payload.role)) {
		errors.push("role is required");
	} else if (!USER_ROLES.includes(role)) {
		errors.push(`role must be one of: ${USER_ROLES.join(", ")}`);
	}

	return {
		isValid: errors.length === 0,
		errors,
		value: {
			name: name || "Campus User",
			role,
		},
	};
};

const validateRegister = (payload = {}) => {
	const errors = [];

	const name = asString(payload.name);
	const email = asString(payload.email).toLowerCase();
	const password = typeof payload.password === "string" ? payload.password : "";
	const role = asString(payload.role).toLowerCase();

	if (!name) {
		errors.push("name is required");
	} else if (name.length > 80) {
		errors.push("name must be at most 80 characters long");
	}

	if (!email) {
		errors.push("email is required");
	} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
		errors.push("email must be a valid email address");
	}

	if (!password) {
		errors.push("password is required");
	} else if (password.length < 8) {
		errors.push("password must be at least 8 characters long");
	}

	if (role && !USER_ROLES.includes(role)) {
		errors.push(`role must be one of: ${USER_ROLES.join(", ")}`);
	}

	return {
		isValid: errors.length === 0,
		errors,
		value: {
			name,
			email,
			password,
			role: role || "faculty",
		},
	};
};

module.exports = {
	USER_ROLES,
	validateLogin,
	validateRegister,
};
