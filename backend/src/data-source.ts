import "reflect-metadata";
import { DataSource } from "typeorm";
import { URL } from "./entity/URL";
import { Click } from "./entity/Click";

export const AppDataSource = new DataSource({
	type: "mysql",
	host: "localhost",
	port: 3306,
	username: "test",
	password: "test",
	database: "test",
	synchronize: true,
	entities: [URL, Click],
	migrations: [],
	subscribers: [],
});
