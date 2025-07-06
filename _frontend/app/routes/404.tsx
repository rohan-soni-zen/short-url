import { Link } from "react-router";
import { Button } from "~/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
} from "~/components/ui/card";

export default function NotFound() {
	return (
		<div className="flex min-h-svh items-center justify-center p-8">
			<div className="transform -translate-y-16">
				<Card className="w-full max-w-md text-center">
					<CardHeader>
						<h1 className="text-6xl font-bold text-muted-foreground">
							404
						</h1>
						<h2 className="text-2xl font-semibold">
							Page Not Found
						</h2>
					</CardHeader>
					<CardContent className="space-y-4">
						<CardDescription>
							The page you're looking for doesn't exist or has
							been moved.
						</CardDescription>
						<Button asChild>
							<Link to="/">Go Home</Link>
						</Button>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
