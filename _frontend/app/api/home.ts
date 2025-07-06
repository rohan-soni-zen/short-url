import axios from "./axios";

export const shortenUrl = ({
	longURL,
	alias,
}: {
	longURL: string;
	alias?: string;
}) => {
	const params = new URLSearchParams({ longURL, alias: alias || "" });
	return axios.post("?" + params);
};
