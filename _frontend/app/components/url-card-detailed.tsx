import { Copy, ExternalLink } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

const URLCardDetailed = ({
	alias,
	longURL,
}: {
	alias: string;
	longURL: string;
}) => {
	const baseUrl = import.meta.env.DEV
		? "http://localhost:3000"
		: window.location.origin;
	const shortUrl = `${baseUrl}/${alias}`;
	return (
		<Card>
			<CardContent>
				<div className="flex gap-4">
					<div className="w-[60%] flex flex-col gap-4 justify-between">
						<span className="text-lg font-semibold flex-1 min-w-0 text-muted-foreground">
							Shortened URL
						</span>
						<div className="flex items-center gap-2 p-3 bg-muted rounded-lg w-fit">
							<span className="font-mono text-sm break-all">
								{shortUrl}
							</span>
							<Button
								onClick={() => {
									const baseUrl = import.meta.env.DEV
										? "http://localhost:3000"
										: window.location.origin;
									const shortUrl = `${baseUrl}/${alias}`;
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
								onClick={() =>
									navigator.clipboard.writeText(shortUrl)
								}
								size="sm"
								variant="ghost"
								className="shrink-0"
								title="Copy URL"
							>
								<Copy className="h-4 w-4" />
							</Button>
						</div>
						<div className="text-sm text-muted-foreground">
							<span className="font-medium">Original URL:</span>
							<p className="break-all mt-1">{longURL}</p>
						</div>
					</div>
					<div className="flex-1 flex justify-center items-center">
						<div className="bg-white dark:bg-black p-2 rounded-xl shadow-md border-2 border-gray-200 dark:border-gray-700 w-[136px] h-[136px] flex items-center justify-center">
							<img
								src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(
									shortUrl
								)}&color=000000&bgcolor=FFFFFF&format=png&margin=0`}
								alt="QR Code for short URL"
								className="w-[120px] h-[120px] dark:hidden"
							/>
							<img
								src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(
									shortUrl
								)}&color=FFFFFF&bgcolor=000000&format=png&margin=0`}
								alt="QR Code for short URL (Dark Mode)"
								className="w-[120px] h-[120px] hidden dark:block"
							/>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
};

export default URLCardDetailed;
