import { validate } from "class-validator";
import * as express from "express";
import { Request, Response } from "express";
import { AppDataSource } from "./data-source";
import { URL } from "./entity/URL";
import { log } from "console";
import cors = require("cors");
import { Click } from "./entity/Click";
const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());
app.use(cors());

AppDataSource.initialize()
	.then(() => {
		console.log("AppDataSource has been initialized!");
	})
	.catch(error => console.error(error));

app.get("/:alias", async (req: Request, res: Response): Promise<void> => {
	try {
		const url = await AppDataSource.getRepository(URL).findOneBy({
			alias: req.params.alias,
		});

		if (!url) {
			res.status(404).json({ error: "URL not found" });
			return;
		}

		const click = new Click();
		click.alias = url.alias;
		click.clickTime = new Date();
		click.url = url;
		await AppDataSource.getRepository(Click).save(click);

		res.redirect(302, url.longURL);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal server error" });
	}
});

app.post("/", async (req: Request, res: Response): Promise<void> => {
	const { longURL, alias } = req.query;
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

		const counts = await AppDataSource.getRepository(URL)
			.createQueryBuilder("url")
			.select(["DATE(url.createTime) AS date", "COUNT(*) AS count"])
			.where(
				"url.createTime >= DATE_SUB(CURDATE(), INTERVAL :days DAY)",
				{ days: days - 1 }
			)
			.groupBy("DATE(url.createTime)")
			.orderBy("date", "DESC")
			.getRawMany();

		res.json(counts);
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

		const counts = await AppDataSource.getRepository(Click)
			.createQueryBuilder("click")
			.select(["DATE(click.clickTime) AS date", "COUNT(*) AS count"])
			.where(
				"click.clickTime >= DATE_SUB(CURDATE(), INTERVAL :days DAY)",
				{
					days: days - 1,
				}
			)
			.groupBy("DATE(click.clickTime)")
			.orderBy("date", "DESC")
			.getRawMany();

		res.json(counts);
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
				.select([
					"url.alias AS alias",
					"url.longURL as longURL",
					"COUNT(*) AS clicks",
				])
				.where(
					"click.clickTime >= DATE_SUB(CURDATE(), INTERVAL :days DAY)",
					{ days: days - 1 }
				)
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

app.use((req: Request, res: Response) => {
	res.status(404).json({ error: "Not found" });
});

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
