import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import { validate } from "class-validator";

export interface RegisterRequest {
	name: string;
	email: string;
	password: string;
}

export interface LoginRequest {
	email: string;
	password: string;
}

export interface AuthResponse {
	success: boolean;
	user?: {
		id: number;
		name: string;
		email: string;
	};
	message?: string;
}

export class AuthService {
	private userRepository = AppDataSource.getRepository(User);

	async register(data: RegisterRequest): Promise<AuthResponse> {
		try {
			// Check if user already exists
			const existingUser = await this.userRepository.findOne({
				where: { email: data.email },
			});

			if (existingUser) {
				return {
					success: false,
					message: "User with this email already exists",
				};
			}

			// Create new user
			const user = new User();
			user.name = data.name;
			user.email = data.email;
			user.password = data.password; // Will be hashed by the entity hook

			// Validate user data
			const errors = await validate(user);
			if (errors.length > 0) {
				const errorMessages = errors
					.map(error =>
						Object.values(error.constraints || {}).join(", ")
					)
					.join("; ");

				return {
					success: false,
					message: errorMessages,
				};
			}

			// Save user
			const savedUser = await this.userRepository.save(user);

			return {
				success: true,
				user: {
					id: savedUser.id,
					name: savedUser.name,
					email: savedUser.email,
				},
			};
		} catch (error) {
			console.error("Registration error:", error);
			return {
				success: false,
				message: "Registration failed. Please try again.",
			};
		}
	}

	async login(data: LoginRequest): Promise<AuthResponse> {
		try {
			// Find user by email
			const user = await this.userRepository.findOne({
				where: { email: data.email },
			});

			if (!user) {
				return {
					success: false,
					message: "Invalid email or password",
				};
			}

			// Validate password
			const isPasswordValid = await user.validatePassword(data.password);
			if (!isPasswordValid) {
				return {
					success: false,
					message: "Invalid email or password",
				};
			}

			return {
				success: true,
				user: {
					id: user.id,
					name: user.name,
					email: user.email,
				},
			};
		} catch (error) {
			console.error("Login error:", error);
			return {
				success: false,
				message: "Login failed. Please try again.",
			};
		}
	}
}
