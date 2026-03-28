const resolveBaseUrl = () => {
	const envUrl = process.env.REACT_APP_API_BASE_URL;

	if (envUrl && envUrl.trim()) {
		return envUrl.trim().replace(/\/$/, "");
	}

	if (typeof window !== "undefined") {
		const { protocol, hostname } = window.location;

		if (hostname === "localhost" || hostname === "127.0.0.1") {
			return "http://localhost:5000";
		}

		if (hostname === "192.168.116.1") {
			return `${protocol}//192.168.116.1:5000`;
		}
	}

	return "https://venue-booking-z528.onrender.com";
};

const BASE_URL = resolveBaseUrl();

export default BASE_URL;
