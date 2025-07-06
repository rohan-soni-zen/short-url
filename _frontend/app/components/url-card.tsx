import { Card } from "./ui/card";

const URLCard = ({
	alias,
	longURL,
	createTime,
}: {
	alias: string;
	longURL: string;
	createTime: string | number | Date;
}) => {
	return (
		<div>
			<Card className="p-4">
				<div className="flex flex-col gap-2">
					<div className="flex items-center justify-between">
						<span className="font-medium text-sm text-muted-foreground">
							Alias
						</span>
						<span className="font-mono text-sm">{alias}</span>
					</div>
					<div className="flex items-center justify-between">
						<span className="font-medium text-sm text-muted-foreground">
							Long URL
						</span>
						<span className="text-sm truncate max-w-[200px]">
							{longURL}
						</span>
					</div>
					<div className="flex items-center justify-between">
						<span className="font-medium text-sm text-muted-foreground">
							Created
						</span>
						<span className="text-sm">
							{new Date(createTime).toLocaleDateString()}
						</span>
					</div>
				</div>
			</Card>
		</div>
	);
};

export default URLCard;
