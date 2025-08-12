import axios from "./axios";

export const getStats = async (days: Number) => {
	const { data: urls } = await axios.get(`/stats/url/${days}`);
	const { data: clicks } = await axios.get(`/stats/click/${days}`);

	return (urls as { date: string; count: string }[])
		.map(
			(
				{ date, count }: { date: string; count: string },
				index: number
			) => ({
				date,
				urls: Number(count),
				clicks: Number(clicks[index].count),
			})
		)
		.reverse();
};

export const getTopURLs = async (days: number, count: number) => {
	const { data } = await axios.get(`/stats/top/${days}/${count}`);
	return data.map((item: any) => ({
		alias: item.alias,
		longURL: item.longURL,
		clicks: Number(item.clicks),
	}));
};
