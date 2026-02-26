const BOOKING_TYPES = ["Seminar", "Lab", "Club", "Workshop", "Lecture"];
const BOOKING_STATUSES = ["Pending", "Approved", "Rejected"];

const asString = (value) => (typeof value === "string" ? value.trim() : "");
const asNumber = (value) => (typeof value === "number" ? value : Number(value));

const isValidDate = (value) => /^\d{4}-\d{2}-\d{2}$/.test(value);
const isValidTime = (value) => /^([01]\d|2[0-3]):([0-5]\d)$/.test(value);

const validateCreateBooking = (payload = {}) => {
	const errors = [];

	const title = asString(payload.title);
	const type = asString(payload.type);
	const spaceId = asNumber(payload.spaceId);
	const date = asString(payload.date);
	const start = asString(payload.start);
	const end = asString(payload.end);
	const participants = asNumber(payload.participants);
	const organizedBy = asString(payload.organizedBy);
	const notes = asString(payload.notes);
	const requestedBy = asString(payload.requestedBy);
	const requestedRole = asString(payload.requestedRole).toLowerCase();

	if (!title) {
		errors.push("title is required");
	} else if (title.length > 120) {
		errors.push("title must be at most 120 characters long");
	}

	if (!type) {
		errors.push("type is required");
	} else if (!BOOKING_TYPES.includes(type)) {
		errors.push(`type must be one of: ${BOOKING_TYPES.join(", ")}`);
	}

	if (!Number.isInteger(spaceId) || spaceId <= 0) {
		errors.push("spaceId must be a positive integer");
	}

	if (!isValidDate(date)) {
		errors.push("date must be in YYYY-MM-DD format");
	}

	if (!isValidTime(start)) {
		errors.push("start must be in HH:mm format");
	}

	if (!isValidTime(end)) {
		errors.push("end must be in HH:mm format");
	}

	if (isValidTime(start) && isValidTime(end) && start >= end) {
		errors.push("end time must be later than start time");
	}

	if (!Number.isFinite(participants) || participants <= 0) {
		errors.push("participants must be greater than 0");
	}

	if (organizedBy && organizedBy.length > 100) {
		errors.push("organizedBy must be at most 100 characters long");
	}

	if (notes && notes.length > 1000) {
		errors.push("notes must be at most 1000 characters long");
	}

	if (requestedBy && requestedBy.length > 80) {
		errors.push("requestedBy must be at most 80 characters long");
	}

	return {
		isValid: errors.length === 0,
		errors,
		value: {
			title,
			type,
			spaceId,
			date,
			start,
			end,
			participants,
			organizedBy,
			notes,
			requestedBy,
			requestedRole,
			status: "Pending",
		},
	};
};

const validateBookingStatusUpdate = (payload = {}) => {
	const errors = [];

	const status = asString(payload.status);

	if (!status) {
		errors.push("status is required");
	} else if (!BOOKING_STATUSES.includes(status)) {
		errors.push(`status must be one of: ${BOOKING_STATUSES.join(", ")}`);
	}

	return {
		isValid: errors.length === 0,
		errors,
		value: { status },
	};
};

const validateBookingQuery = (query = {}) => {
	const errors = [];

	const spaceId = query.spaceId === undefined ? undefined : asNumber(query.spaceId);
	const status = query.status === undefined ? undefined : asString(query.status);
	const date = query.date === undefined ? undefined : asString(query.date);

	if (spaceId !== undefined && (!Number.isInteger(spaceId) || spaceId <= 0)) {
		errors.push("spaceId must be a positive integer when provided");
	}

	if (status !== undefined && status && !BOOKING_STATUSES.includes(status)) {
		errors.push(`status must be one of: ${BOOKING_STATUSES.join(", ")}`);
	}

	if (date !== undefined && date && !isValidDate(date)) {
		errors.push("date must be in YYYY-MM-DD format when provided");
	}

	return {
		isValid: errors.length === 0,
		errors,
		value: {
			...(spaceId !== undefined ? { spaceId } : {}),
			...(status !== undefined && status ? { status } : {}),
			...(date !== undefined && date ? { date } : {}),
		},
	};
};

module.exports = {
	BOOKING_TYPES,
	BOOKING_STATUSES,
	validateCreateBooking,
	validateBookingStatusUpdate,
	validateBookingQuery,
};
