import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

import { JoinColumn, ManyToOne } from "typeorm";
import { URL } from "./URL";

@Entity()
export class Click {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	alias: string;

	@Column()
	clickTime: Date;

	@ManyToOne(() => URL, url => url.alias)
	@JoinColumn({ name: "alias", referencedColumnName: "alias" })
	url: URL;
}
