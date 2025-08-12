import { Router, Request, Response } from "express";
import { AuthService } from "../services/AuthService";
import { z } from "zod";

const router = Router();
const authService = new AuthService();

const RegisterSchema = z.object({
	name: z
		.string()
		.min(1, "Name is required")
		.min(2, "Name must be at least 2 characters long")
		.max(50, "Name must be less than 50 characters"),
	email: z
		.string()
		.min(1, "Email is required")
		.email("Please enter a valid email address"),
	password: z
		.string()
		.min(1, "Password is required")
		.min(6, "Password must be at least 6 characters long")
		.max(100, "Password must be less than 100 characters"),
});

const LoginSchema = z.object({
	email: z.email(),
	password: z
		.string()
		.min(1, "Password is required")
		.min(6, "Password must be at least 6 characters long"),
});

router.post("/register", async (req: Request, res: Response): Promise<void> => {
	try {
		const validationResult = RegisterSchema.safeParse(req.body);

		if (!validationResult.success) {
			const errorMessages = validationResult.error.issues
				.map(issue => issue.message)
				.join(", ");

			res.status(400).json({
				success: false,
				message: errorMessages,
			});
			return;
		}

		const { name, email, password } = validationResult.data;
		const result = await authService.register({ name, email, password });

		if (!result.success) {
			res.status(400).json(result);
			return;
		}

		res.status(201).json(result);
	} catch (error) {
		console.error("Register route error:", error);
		res.status(500).json({
			success: false,
			message: "Internal server error",
		});
	}
});

router.post("/login", async (req: Request, res: Response): Promise<void> => {
	try {
		const validationResult = LoginSchema.safeParse(req.body);

		if (!validationResult.success) {
			const errorMessages = validationResult.error.issues
				.map(issue => issue.message)
				.join(", ");

			res.status(400).json({
				success: false,
				message: errorMessages,
			});
			return;
		}

		const { email, password } = validationResult.data;
		const result = await authService.login({ email, password });

		if (!result.success) {
			res.status(401).json(result);
			return;
		}

		res.json(result);
	} catch (error) {
		console.error("Login route error:", error);
		res.status(500).json({
			success: false,
			message: "Internal server error",
		});
	}
});

export default router;
