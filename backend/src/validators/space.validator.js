const asString = (value) => (typeof value === "string" ? value.trim() : "");
const asNumber = (value) => (typeof value === "number" ? value : Number(value));

const validateCreateSpace = (payload = {}) => {
	const errors = [];

	const name = asString(payload.name);
	const type = asString(payload.type);
	const capacity = asNumber(payload.capacity);

	if (!name) {
		errors.push("name is required");
	} else if (name.length > 100) {
		errors.push("name must be at most 100 characters long");
	}

	if (!type) {
		errors.push("type is required");
	} else if (type.length > 60) {
		errors.push("type must be at most 60 characters long");
	}

	if (!Number.isInteger(capacity) || capacity <= 0) {
		errors.push("capacity must be a positive integer");
	} else if (capacity > 5000) {
		errors.push("capacity must be less than or equal to 5000");
	}

	return {
		isValid: errors.length === 0,
		errors,
		value: {
			name,
			type,
			capacity,
		},
	};
};

const validateUpdateSpace = (payload = {}) => {
	const errors = [];

	const id = asNumber(payload.id);
	const createResult = validateCreateSpace(payload);

	if (!Number.isInteger(id) || id <= 0) {
		errors.push("id must be a positive integer");
	}

	return {
		isValid: errors.length === 0 && createResult.isValid,
		errors: [...errors, ...createResult.errors],
		value: {
			id,
			...createResult.value,
		},
	};
};

const validateSpaceQuery = (query = {}) => {
	const errors = [];

	const type = query.type === undefined ? undefined : asString(query.type);
	const minCapacity = query.minCapacity === undefined ? undefined : asNumber(query.minCapacity);
	const maxCapacity = query.maxCapacity === undefined ? undefined : asNumber(query.maxCapacity);

	if (type !== undefined && type.length > 60) {
		errors.push("type must be at most 60 characters long when provided");
	}

	if (minCapacity !== undefined && (!Number.isInteger(minCapacity) || minCapacity < 0)) {
		errors.push("minCapacity must be a non-negative integer when provided");
	}

	if (maxCapacity !== undefined && (!Number.isInteger(maxCapacity) || maxCapacity < 0)) {
		errors.push("maxCapacity must be a non-negative integer when provided");
	}

	if (
		Number.isInteger(minCapacity) &&
		Number.isInteger(maxCapacity) &&
		minCapacity > maxCapacity
	) {
		errors.push("minCapacity cannot be greater than maxCapacity");
	}

	return {
		isValid: errors.length === 0,
		errors,
		value: {
			...(type !== undefined && type ? { type } : {}),
			...(minCapacity !== undefined ? { minCapacity } : {}),
			...(maxCapacity !== undefined ? { maxCapacity } : {}),
		},
	};
};

module.exports = {
	validateCreateSpace,
	validateUpdateSpace,
	validateSpaceQuery,
};
