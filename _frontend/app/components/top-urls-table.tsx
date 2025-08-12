import { useQuery } from "@tanstack/react-query";
import { ExternalLink, Copy, TrendingUp } from "lucide-react";
import { getTopURLs } from "~/api/stats";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "~/components/ui/table";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { toast } from "sonner";

interface TopURL {
	alias: string;
	longURL: string;
	clicks: number;
	creatorName?: string;
	creatorEmail?: string;
}

interface TopURLsTableProps {
	timeRange: string;
}

export function TopURLsTable({ timeRange }: TopURLsTableProps) {
	const {
		data: topURLs = [],
		isLoading,
		error,
	} = useQuery({
		queryKey: ["topURLs", timeRange],
		queryFn: () => getTopURLs(Number(timeRange), 10), // Fixed count to 10
		enabled: true,
		retry: 3,
	});

	const copyToClipboard = (alias: string) => {
		const baseUrl = import.meta.env.DEV
			? "http://localhost:3000"
			: window.location.origin;
		const shortUrl = `${baseUrl}/${alias}`;
		navigator.clipboard.writeText(shortUrl);
		toast.success("Short URL copied to clipboard!");
	};

	const openURL = (alias: string) => {
		const baseUrl = import.meta.env.DEV
			? "http://localhost:3000"
			: window.location.origin;
		const shortUrl = `${baseUrl}/${alias}`;
		window.open(shortUrl, "_blank");
	};

	return (
		<div className="w-full">
			{isLoading ? (
				<div className="flex items-center justify-center h-32">
					<div className="text-muted-foreground">Loading...</div>
				</div>
			) : error ? (
				<div className="flex items-center justify-center h-32">
					<div className="text-destructive">Failed to load data</div>
				</div>
			) : topURLs.length === 0 ? (
				<div className="flex items-center justify-center h-32">
					<div className="text-muted-foreground">
						No data available
					</div>
				</div>
			) : (
				<div className="overflow-auto border rounded-md">
					<Table>
						<TableHeader className="sticky top-0 bg-background/95 backdrop-blur z-10 border-b">
							<TableRow>
								<TableHead className="w-16 text-center">
									#
								</TableHead>
								<TableHead className="w-48">
									Short URL
								</TableHead>
								<TableHead className="hidden md:table-cell min-w-0">
									Long URL
								</TableHead>
								<TableHead className="w-32">Creator</TableHead>
								<TableHead className="w-24 text-right">
									Clicks
								</TableHead>
								<TableHead className="w-20 text-center">
									Actions
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{topURLs.map((url: TopURL, index: number) => (
								<TableRow
									key={url.alias}
									className="hover:bg-muted/50"
								>
									<TableCell className="text-center">
										<Badge
											variant={
												index < 3
													? "default"
													: "secondary"
											}
											className="w-6 h-6 rounded-full flex items-center justify-center text-xs"
										>
											{index + 1}
										</Badge>
									</TableCell>
									<TableCell>
										<div className="font-mono text-sm bg-muted px-2 py-1 rounded truncate">
											/{url.alias}
										</div>
									</TableCell>
									<TableCell className="hidden md:table-cell">
										<div className="truncate text-muted-foreground text-sm">
											{url.longURL}
										</div>
									</TableCell>
									<TableCell>
										{url.creatorName ? (
											<div className="text-sm">
												<div className="font-medium">
													{url.creatorName}
												</div>
												<div className="text-xs text-muted-foreground truncate">
													{url.creatorEmail}
												</div>
											</div>
										) : (
											<span className="text-xs text-muted-foreground">
												Anonymous
											</span>
										)}
									</TableCell>
									<TableCell className="text-right">
										<Badge
											variant="outline"
											className="font-mono text-xs"
										>
											{url.clicks.toLocaleString()}
										</Badge>
									</TableCell>
									<TableCell className="text-center">
										<div className="flex gap-1 justify-center">
											<Button
												variant="ghost"
												size="sm"
												onClick={() =>
													copyToClipboard(url.alias)
												}
												className="h-7 w-7 p-0"
												title="Copy short URL"
											>
												<Copy className="h-3 w-3" />
											</Button>
											<Button
												variant="ghost"
												size="sm"
												onClick={() =>
													openURL(url.alias)
												}
												className="h-7 w-7 p-0"
												title="Open URL"
											>
												<ExternalLink className="h-3 w-3" />
											</Button>
										</div>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			)}
		</div>
	);
}
