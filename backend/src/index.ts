import { validate } from "class-validator";
import { log } from "console";
import * as express from "express";
import { Request, Response } from "express";
import * as path from "path";
import { AppDataSource } from "./data-source";
import { Click } from "./entity/Click";
import { URL } from "./entity/URL";
import authRoutes from "./routes/auth";
import cors = require("cors");
const PORT = process.env.PORT || 3000;
import cron = require("node-cron");

const app = express();
app.use(express.json());
app.use(cors());

app.use(express.static(path.join(__dirname, "../build/client")));

app.use("/api/auth", authRoutes);

app.get("/", (req: Request, res: Response) => {
	res.sendFile(path.join(__dirname, "../build/client/index.html"));
});

app.get("/not-found", (req: Request, res: Response) => {
	res.sendFile(path.join(__dirname, "../build/client/index.html"));
});

app.get("/:alias", async (req: Request, res: Response): Promise<void> => {
	try {
		console.log(`Click attempt for alias: ${req.params.alias}`);

		const url = await AppDataSource.getRepository(URL).findOneBy({
			alias: req.params.alias,
		});

		if (!url) {
			console.log(`URL not found for alias: ${req.params.alias}`);
			res.sendFile(path.join(__dirname, "../build/client/index.html"));
			return;
		}

		console.log(
			`URL found, creating click for: ${url.alias} -> ${url.longURL}`
		);

		const click = new Click();
		click.alias = url.alias;
		click.clickTime = new Date();
		click.url = url;

		const savedClick = await AppDataSource.getRepository(Click).save(click);
		console.log(`Click saved successfully with ID: ${savedClick.id}`);

		res.redirect(302, url.longURL);
	} catch (error) {
		console.error(
			`Error processing click for alias ${req.params.alias}:`,
			error
		);
		res.status(500).json({ error: "Internal server error" });
	}
});

// Simple middleware to extract user info from headers (for demo purposes)
const extractUser = (req: Request) => {
	const userId = req.headers["x-user-id"] as string;
	const userEmail = req.headers["x-user-email"] as string;
	return userId && userEmail
		? { id: parseInt(userId), email: userEmail }
		: null;
};

app.post("/", async (req: Request, res: Response): Promise<void> => {
	const { longURL, alias } = req.query;
	const user = extractUser(req);
	const parsedLongURL = String(longURL || "").trim();
	const parsedAlias = String(alias || "").trim();

	if (!parsedLongURL) {
		res.status(400).json({ error: "longURL is required" });
		return;
	}

	const url = new URL();
	let tries = 10;

	do {
		url.alias = parsedAlias || Math.random().toString(36).substring(2, 8);
	} while (
		(await AppDataSource.getRepository(URL).findOneBy({
			alias: url.alias,
		})) &&
		--tries
	);

	if (!tries) {
		res.status(parsedAlias ? 400 : 500).json({
			error: "Alias not available",
		});
		return;
	}

	url.longURL = parsedLongURL;
	url.createTime = new Date();

	// Set userId if user is authenticated
	if (user) {
		url.userId = user.id;
	}

	const errors = await validate(url);
	if (errors.length > 0) {
		log(errors);
		res.status(400).json({
			error:
				Object.values(errors[0].constraints)[0] ??
				"Something Went Wrong!",
		});
		return;
	}

	await AppDataSource.getRepository(URL).save(url);
	res.status(201).json(url);
});

app.get(
	"/stats/url/:days",
	async (req: Request, res: Response): Promise<void> => {
		const days = parseInt(req.params.days, 10);
		if (isNaN(days) || days <= 0) {
			res.status(400).json({ error: "Invalid days parameter" });
			return;
		}

		const allDates = Array.from({ length: days }).map((_, i) => {
			const date = new Date();
			date.setDate(date.getDate() - i);
			return date.toISOString().split("T")[0];
		});

		const counts: { date: string; count: number }[] =
			await AppDataSource.getRepository(URL)
				.createQueryBuilder("url")
				.select([
					"strftime('%Y-%m-%d', url.createTime) AS date",
					"COUNT(*) AS count",
				])
				.where("url.createTime >= datetime('now', '-:days days')", {
					days,
				})
				.groupBy("strftime('%Y-%m-%d', url.createTime)")
				.orderBy("date", "DESC")
				.getRawMany();

		const dataMap = new Map<string, number>();
		counts.forEach(item => {
			dataMap.set(item.date, item.count);
		});

		const result = allDates.map(date => ({
			date: date,
			count: dataMap.get(date) || 0,
		}));

		res.json(result);
	}
);

app.get(
	"/stats/click/:days",
	async (req: Request, res: Response): Promise<void> => {
		const days = parseInt(req.params.days, 10);
		if (isNaN(days) || days <= 0) {
			res.status(400).json({ error: "Invalid days parameter" });
			return;
		}

		const allDates = Array.from({ length: days }).map((_, i) => {
			const date = new Date();
			date.setDate(date.getDate() - i);
			return date.toISOString().split("T")[0];
		});

		const counts: { date: string; count: number }[] =
			await AppDataSource.getRepository(Click)
				.createQueryBuilder("click")
				.select([
					"strftime('%Y-%m-%d', click.clickTime) AS date",
					"COUNT(*) AS count",
				])
				.where("click.clickTime >= datetime('now', '-:days days')", {
					days,
				})
				.groupBy("strftime('%Y-%m-%d', click.clickTime)")
				.orderBy("date", "DESC")
				.getRawMany();

		const dataMap = new Map<string, number>();
		counts.forEach(item => {
			dataMap.set(item.date, item.count);
		});

		const result = allDates.map(date => ({
			date: date,
			count: dataMap.get(date) || 0,
		}));

		res.json(result);
	}
);

app.get(
	"/stats/top/:days/:count",
	async (req: Request, res: Response): Promise<void> => {
		const days = parseInt(req.params.days);
		const count = parseInt(req.params.count);

		if (isNaN(days) || days <= 0 || isNaN(count) || count <= 0) {
			res.status(400).json({ error: "Invalid days or count parameter" });
			return;
		}

		try {
			const topAliases = await AppDataSource.getRepository(Click)
				.createQueryBuilder("click")
				.innerJoin("click.url", "url")
				.leftJoin("url.user", "user")
				.select([
					"url.alias AS alias",
					"url.longURL as longURL",
					"COUNT(*) AS clicks",
					"user.name AS creatorName",
					"user.email AS creatorEmail",
				])
				.where("click.clickTime >= datetime('now', '-:days days')", {
					days,
				})
				.groupBy("url.alias")
				.orderBy("clicks", "DESC")
				.limit(count)
				.getRawMany();

			res.json(topAliases);
		} catch (error) {
			res.status(500).json({ error: "Internal server error" });
		}
	}
);

app.post("/faker", async (req: Request, res: Response): Promise<void> => {
	try {
		const { days = 30 } = req.query;
		const daysInt = parseInt(String(days));

		if (isNaN(daysInt) || daysInt <= 0) {
			res.status(400).json({ error: "Invalid days parameter" });
			return;
		}

		const { createdURLs, totalClicks } = await faker(daysInt);

		res.json({
			message: "Fake data generated successfully",
			urlsCreated: createdURLs.length,
			clicksCreated: totalClicks,
			days: daysInt,
		});
	} catch (error) {
		console.error("Error generating fake data:", error);
		res.status(500).json({ error: "Failed to generate fake data" });
	}
});

app.use((req: Request, res: Response) => {
	res.status(404).json({ error: "Not found" });
});

AppDataSource.initialize()
	.then(() => {
		console.log("AppDataSource has been initialized!");
		faker();
	})
	.catch(error => console.error(error));

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);

	cron.schedule(
		"0 9 * * *",
		() => {
			console.log("📅 Scheduled task running at 9AM");
			faker();
		},
		{
			timezone: "Asia/Kolkata",
		}
	);
});

async function faker(daysInt: number = 90) {
	await AppDataSource.getRepository(Click)
		.createQueryBuilder()
		.delete()
		.execute();
	await AppDataSource.getRepository(URL)
		.createQueryBuilder()
		.delete()
		.execute();

	const fakeURLs = [
		{ alias: "google", longURL: "https://www.google.com" },
		{ alias: "github", longURL: "https://github.com" },
		{ alias: "stack", longURL: "https://stackoverflow.com" },
		{ alias: "youtube", longURL: "https://www.youtube.com" },
		{ alias: "twitter", longURL: "https://twitter.com" },
		{ alias: "linkedin", longURL: "https://www.linkedin.com" },
		{ alias: "reddit", longURL: "https://www.reddit.com" },
		{ alias: "amazon", longURL: "https://www.amazon.com" },
		{ alias: "netflix", longURL: "https://www.netflix.com" },
		{ alias: "spotify", longURL: "https://open.spotify.com" },
		{ alias: "discord", longURL: "https://discord.com" },
		{ alias: "slack", longURL: "https://slack.com" },
		{ alias: "zoom", longURL: "https://zoom.us" },
		{ alias: "figma", longURL: "https://www.figma.com" },
		{ alias: "notion", longURL: "https://www.notion.so" },
		{ alias: "apple", longURL: "https://www.apple.com" },
		{ alias: "microsoft", longURL: "https://www.microsoft.com" },
		{ alias: "facebook", longURL: "https://www.facebook.com" },
		{ alias: "instagram", longURL: "https://www.instagram.com" },
		{ alias: "bing", longURL: "https://www.bing.com" },
		{ alias: "yahoo", longURL: "https://www.yahoo.com" },
		{ alias: "duckduckgo", longURL: "https://duckduckgo.com" },
		{ alias: "quora", longURL: "https://www.quora.com" },
		{ alias: "medium", longURL: "https://medium.com" },
		{ alias: "devto", longURL: "https://dev.to" },
		{ alias: "npmjs", longURL: "https://www.npmjs.com" },
		{ alias: "ycombinator", longURL: "https://news.ycombinator.com" },
		{ alias: "bbcnews", longURL: "https://www.bbc.com/news" },
		{ alias: "cnnnews", longURL: "https://www.cnn.com" },
		{ alias: "nytimes", longURL: "https://www.nytimes.com" },
		{ alias: "espn", longURL: "https://www.espn.com" },
		{ alias: "nba", longURL: "https://www.nba.com" },
		{ alias: "fifa", longURL: "https://www.fifa.com" },
		{ alias: "wikipedia", longURL: "https://www.wikipedia.org" },
		{ alias: "imdb", longURL: "https://www.imdb.com" },
		{ alias: "pinterest", longURL: "https://www.pinterest.com" },
		{ alias: "tumblr", longURL: "https://www.tumblr.com" },
		{ alias: "dropbox", longURL: "https://www.dropbox.com" },
		{ alias: "drive", longURL: "https://drive.google.com" },
		{ alias: "trello", longURL: "https://trello.com" },
		{ alias: "asana", longURL: "https://asana.com" },
		{ alias: "airbnb", longURL: "https://www.airbnb.com" },
		{ alias: "uber", longURL: "https://www.uber.com" },
		{ alias: "swiggy", longURL: "https://www.swiggy.com" },
		{ alias: "zomato", longURL: "https://www.zomato.com" },
		{ alias: "flipkart", longURL: "https://www.flipkart.com" },
		{ alias: "myntra", longURL: "https://www.myntra.com" },
		{ alias: "shopify", longURL: "https://www.shopify.com" },
		{ alias: "adobe", longURL: "https://www.adobe.com" },
		{ alias: "canva", longURL: "https://www.canva.com" },
		{ alias: "coursera", longURL: "https://www.coursera.org" },
		{ alias: "udemy", longURL: "https://www.udemy.com" },
		{ alias: "khanacademy", longURL: "https://www.khanacademy.org" },
		{ alias: "leetcode", longURL: "https://leetcode.com" },
		{ alias: "codeforces", longURL: "https://codeforces.com" },
		{ alias: "codechef", longURL: "https://www.codechef.com" },
		{ alias: "hackernews", longURL: "https://news.ycombinator.com" },
		{ alias: "producthunt", longURL: "https://www.producthunt.com" },
		{ alias: "behance", longURL: "https://www.behance.net" },
		{ alias: "dribbble", longURL: "https://dribbble.com" },
		{ alias: "unsplash", longURL: "https://unsplash.com" },
		{ alias: "pixabay", longURL: "https://pixabay.com" },
		{ alias: "pexels", longURL: "https://www.pexels.com" },
		{ alias: "giphy", longURL: "https://giphy.com" },
		{ alias: "tenor", longURL: "https://tenor.com" },
		{ alias: "weather", longURL: "https://weather.com" },
		{ alias: "maps", longURL: "https://maps.google.com" },
		{ alias: "calendar", longURL: "https://calendar.google.com" },
		{ alias: "mail", longURL: "https://mail.google.com" },
		{ alias: "news", longURL: "https://news.google.com" },
		{ alias: "finance", longURL: "https://finance.yahoo.com" },
		{ alias: "crypto", longURL: "https://www.coinmarketcap.com" },
		{ alias: "weatherapp", longURL: "https://www.accuweather.com" },
		{ alias: "randomfun", longURL: "https://www.boredpanda.com" },
		{ alias: "memes", longURL: "https://www.memedroid.com" },
		{ alias: "catpics", longURL: "https://www.catpics.com" },
		{ alias: "doggo", longURL: "https://www.dogtime.com" },
	];

	const urlRepository = AppDataSource.getRepository(URL);
	const clickRepository = AppDataSource.getRepository(Click);

	function getStronglySkewedDay(daysInt: number) {
		return Math.floor(Math.random() ** 3 * daysInt);
	}

	const today = new Date();
	console.log(`Faker: Generating data relative to ${today.toISOString()}`);

	const createdURLs: URL[] = [];
	for (const fakeURL of fakeURLs) {
		const url = new URL();
		url.alias = fakeURL.alias;
		url.longURL = fakeURL.longURL;
		const dayOffset = getStronglySkewedDay(daysInt);
		const createDate = new Date(today);
		createDate.setDate(today.getDate() - dayOffset);

		// Ensure creation time is never in the future
		if (createDate > today) {
			createDate.setTime(today.getTime());
		}

		url.createTime = createDate;
		await urlRepository.save(url);
		createdURLs.push(url);
	}

	console.log(`Created ${createdURLs.length} fake URLs`);

	let totalClicks = 0;
	for (const url of createdURLs) {
		const age = Math.floor(
			(today.getTime() - url.createTime.getTime()) / (24 * 60 * 60 * 1000)
		);
		const maxPossible = Math.max(daysInt - age, 1);
		const clickCount =
			Math.floor(maxPossible * 2 + Math.random() ** 3 * 50) + 5;
		for (let i = 0; i < clickCount; i++) {
			const click = new Click();
			click.alias = url.alias;
			click.url = url;
			// Generate click time relative to today, not relative to URL creation
			const clickDayOffset = getStronglySkewedDay(daysInt);
			const clickDate = new Date(today);
			clickDate.setDate(today.getDate() - clickDayOffset);

			// Ensure click time is never in the future
			if (clickDate > today) {
				clickDate.setTime(today.getTime());
			}

			click.clickTime = clickDate;
			await clickRepository.save(click);
			totalClicks++;
		}
	}

	console.log(`Created ${totalClicks} fake clicks`);

	return { createdURLs, totalClicks };
}
