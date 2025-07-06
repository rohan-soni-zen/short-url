import { cn } from "~/lib/utils";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Copy, ExternalLink } from "lucide-react";

interface RecentEntry {
	alias: string;
	longURL: string;
	createTime: string;
}

interface RecentsProps extends React.ComponentPropsWithoutRef<"div"> {
	recents: RecentEntry[];
}

const Recents = ({ className, recents, ...props }: RecentsProps) => {
	return (
		<div className={cn("flex flex-col gap-6 h-full", className)} {...props}>
			<span className="text-xl font-extralight">Recents</span>
			<div className="space-y-4 overflow-y-scroll max-h-[calc(100vh-200px)] flex-1 sticky top-0">
				{recents.length === 0 ? (
					<p className="text-muted-foreground">No recent URLs</p>
				) : (
					recents
						.slice()
						.reverse()
						.map((entry, index) => (
							<Card key={index} className="p-4">
								<CardContent className="p-0">
									<div className="flex justify-between items-start">
										<div className="flex-1">
											<p className="font-medium">
												{entry.alias}
											</p>
											<p className="text-sm text-muted-foreground truncate max-w-[400px]">
												{entry.longURL}
											</p>
											<p className="text-xs text-muted-foreground">
												{new Date(
													entry.createTime
												).toLocaleDateString("en-US", {
													year: "numeric",
													month: "short",
													day: "numeric",
													hour: "2-digit",
													minute: "2-digit",
												})}
											</p>
										</div>
										<Button
											onClick={() => {
												const baseUrl = import.meta.env
													.DEV
													? "http://localhost:3000"
													: window.location.origin;
												const shortUrl = `${baseUrl}/${entry.alias}`;
												window.open(shortUrl, "_blank");
											}}
											size="icon"
											variant="ghost"
											className="ml-2"
											title="Open short URL"
										>
											<ExternalLink className="h-4 w-4" />
										</Button>
										<Button
											onClick={() => {
												const baseUrl = import.meta.env
													.DEV
													? "http://localhost:3000"
													: window.location.origin;
												const shortUrl = `${baseUrl}/${entry.alias}`;
												navigator.clipboard.writeText(
													shortUrl
												);
											}}
											size="icon"
											variant="ghost"
											className="ml-2"
											title="Copy short URL"
										>
											<Copy className="h-4 w-4" />
										</Button>
									</div>
								</CardContent>
							</Card>
						))
				)}
			</div>
		</div>
	);
};

export default Recents;
