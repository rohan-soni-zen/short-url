import { IsDate, IsUrl, Matches, MaxLength, MinLength } from "class-validator";
import { Column, Entity, PrimaryColumn, OneToMany } from "typeorm";
import { Click } from "./Click";

@Entity()
export class URL {
	@PrimaryColumn()
	@Matches(/^[\w.-]*$/, { message: "Invalid Alias!" })
	@MinLength(5, { message: "Alias must be atleast 5 chars long" })
	@MaxLength(15, { message: "Alias can be atmost 15 chars long" })
	alias: string;

	@Column()
	@IsUrl({}, { message: "Invalid Long URL" })
	longURL: string;

	@Column()
	@IsDate({ message: "Invalid Date" })
	createTime: Date;

	@OneToMany(() => Click, click => click.url)
	clicks: Click[];
}
