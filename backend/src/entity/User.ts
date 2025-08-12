import { IsEmail, MinLength } from "class-validator";
import {
	Column,
	Entity,
	PrimaryGeneratedColumn,
	OneToMany,
	CreateDateColumn,
	BeforeInsert,
	BeforeUpdate,
} from "typeorm";
import { URL } from "./URL";
import * as bcrypt from "bcrypt";

@Entity()
export class User {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	@MinLength(2, { message: "Name must be at least 2 characters long" })
	name: string;

	@Column({ unique: true })
	@IsEmail({}, { message: "Invalid email address" })
	email: string;

	@Column()
	@MinLength(6, { message: "Password must be at least 6 characters long" })
	password: string;

	@CreateDateColumn()
	createdAt: Date;

	@OneToMany(() => URL, url => url.user)
	urls: URL[];

	@BeforeInsert()
	@BeforeUpdate()
	async hashPassword() {
		if (this.password) {
			this.password = await bcrypt.hash(this.password, 10);
		}
	}

	async validatePassword(password: string): Promise<boolean> {
		return bcrypt.compare(password, this.password);
	}
}
