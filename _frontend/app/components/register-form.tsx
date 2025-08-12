import { UserPlus } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "./ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "./ui/form";
import { useAuth } from "~/contexts/AuthContext";
import { useAuthModal } from "~/contexts/AuthModalContext";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

const RegisterSchema = z
	.object({
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
		confirmPassword: z.string().min(1, "Please confirm your password"),
	})
	.refine(data => data.password === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	});

export function RegisterForm() {
	const { register, loading } = useAuth();
	const { openModal, openLoginModal, openRegisterModal, closeModal } =
		useAuthModal();
	const isOpen = openModal === "register";

	const form = useForm<z.infer<typeof RegisterSchema>>({
		resolver: zodResolver(RegisterSchema),
		defaultValues: {
			name: "",
			email: "",
			password: "",
			confirmPassword: "",
		},
	});

	const onSubmit = async (data: z.infer<typeof RegisterSchema>) => {
		const result = await register({
			name: data.name,
			email: data.email,
			password: data.password,
		});

		if (result.success) {
			toast.success("Registration successful!");
			closeModal();
			form.reset();
		} else {
			toast.error(result.message || "Registration failed");
		}
	};

	const handleOpenChange = (open: boolean) => {
		if (open) {
			openRegisterModal();
		} else {
			closeModal();
			form.reset();
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={handleOpenChange}>
			<DialogTrigger asChild>
				<Button variant="outline" size="sm" className="gap-2">
					<UserPlus className="h-4 w-4" />
					Sign Up
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Create Account</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-4"
						noValidate
					>
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Full Name</FormLabel>
									<FormControl>
										<Input
											type="text"
											placeholder="Enter your full name"
											disabled={loading}
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input
											type="email"
											placeholder="Enter your email"
											disabled={loading}
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="password"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Password</FormLabel>
									<FormControl>
										<Input
											type="password"
											placeholder="Enter your password"
											disabled={loading}
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="confirmPassword"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Confirm Password</FormLabel>
									<FormControl>
										<Input
											type="password"
											placeholder="Confirm your password"
											disabled={loading}
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button
							type="submit"
							className="w-full"
							disabled={loading}
						>
							{loading ? "Creating Account..." : "Create Account"}
						</Button>

						<div className="text-center text-sm text-muted-foreground">
							Already have an account?{" "}
							<button
								type="button"
								onClick={() => {
									closeModal();
									openLoginModal();
								}}
								className="text-primary hover:underline font-medium"
							>
								Sign in
							</button>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
