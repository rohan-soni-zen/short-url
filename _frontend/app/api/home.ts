import axios from "./axios";

export const shortenUrl = ({
	longURL,
	alias,
}: {
	longURL: string;
	alias?: string;
}) => {
	const params = new URLSearchParams({ longURL, alias: alias || "" });

	// Get user info from localStorage if available
	const user = localStorage.getItem("user");
	let headers = {};

	if (user) {
		try {
			const userData = JSON.parse(user);
			headers = {
				"x-user-id": userData.id,
				"x-user-email": userData.email,
			};
		} catch (e) {
			console.warn("Failed to parse user data from localStorage");
		}
	}

	return axios.post("?" + params, null, { headers });
};
