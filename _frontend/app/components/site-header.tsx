import { Github } from "lucide-react";
import { ModeToggle } from "./mode-toggle";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { SidebarTrigger } from "./ui/sidebar";
import { LoginForm } from "./login-form";
import { RegisterForm } from "./register-form";
import { useAuth } from "~/contexts/AuthContext";

export function SiteHeader() {
	const { isAuthenticated } = useAuth();

	return (
		<header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
			<div className="flex w-full items-center gap-1 px-4 pb-2 lg:gap-2 lg:px-6">
				<SidebarTrigger className="-ml-1" />
				<Separator
					orientation="vertical"
					className="mx-2 data-[orientation=vertical]:h-4"
				/>
				<div className="ml-auto flex items-center gap-2 py-2">
					{!isAuthenticated && (
						<>
							<LoginForm />
							<RegisterForm />
						</>
					)}
					<ModeToggle />
					<Button
						variant="ghost"
						asChild
						size="sm"
						className="sm:flex"
					>
						<a
							href="https://github.com/rohan-soni-zen/short-url"
							rel="noopener noreferrer"
							target="_blank"
							className="dark:text-foreground"
						>
							<Github />
							<span className="hidden sm:flex">GitHub</span>
						</a>
					</Button>
				</div>
			</div>
		</header>
	);
}
