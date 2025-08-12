import { IsDate, IsUrl, Matches, MaxLength, MinLength } from "class-validator";
import {
	Column,
	Entity,
	PrimaryColumn,
	OneToMany,
	ManyToOne,
	JoinColumn,
} from "typeorm";
import { Click } from "./Click";
import { User } from "./User";

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

	@ManyToOne(() => User, user => user.urls, { nullable: true })
	@JoinColumn({ name: "userId" })
	user?: User;

	@Column({ nullable: true })
	userId?: number;

	@OneToMany(() => Click, click => click.url)
	clicks: Click[];
}
