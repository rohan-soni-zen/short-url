import "reflect-metadata";
import { DataSource } from "typeorm";
import { URL } from "./entity/URL";
import { Click } from "./entity/Click";
import { User } from "./entity/User";

export const AppDataSource = new DataSource({
	type: "sqlite",
	database: "shorturl.db",
	synchronize: true,
	entities: [URL, Click, User],
	migrations: [],
	subscribers: [],
});
