import { LogIn } from "lucide-react";
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

const LoginSchema = z.object({
	email: z
		.string()
		.min(1, "Email is required")
		.email("Please enter a valid email address"),
	password: z
		.string()
		.min(1, "Password is required")
		.min(6, "Password must be at least 6 characters long"),
});

export function LoginForm() {
	const { login, loading } = useAuth();
	const { openModal, openLoginModal, openRegisterModal, closeModal } =
		useAuthModal();
	const isOpen = openModal === "login";

	const form = useForm<z.infer<typeof LoginSchema>>({
		resolver: zodResolver(LoginSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const onSubmit = async (data: z.infer<typeof LoginSchema>) => {
		const result = await login(data);

		if (result.success) {
			toast.success("Login successful!");
			closeModal();
			form.reset();
		} else {
			toast.error(result.message || "Login failed");
		}
	};

	const handleOpenChange = (open: boolean) => {
		if (open) {
			openLoginModal();
		} else {
			closeModal();
			form.reset();
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={handleOpenChange}>
			<DialogTrigger asChild>
				<Button variant="outline" size="sm" className="gap-2">
					<LogIn className="h-4 w-4" />
					Sign In
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Sign In</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-4"
						noValidate
					>
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
						<Button
							type="submit"
							className="w-full"
							disabled={loading}
						>
							{loading ? "Signing In..." : "Sign In"}
						</Button>
						<div className="text-center">
							<p className="text-sm text-muted-foreground">
								Don't have an account?{" "}
								<Button
									variant="link"
									size="sm"
									className="p-0 h-auto font-normal text-primary"
									onClick={() => {
										closeModal();
										openRegisterModal();
									}}
									type="button"
								>
									Sign up
								</Button>
							</p>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
