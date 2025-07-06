import { Plus, Mail } from "lucide-react";
import { useLocation } from "react-router";
import { useState } from "react";
import { Button } from "./ui/button";
import {
	SidebarGroup,
	SidebarGroupContent,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "./ui/sidebar";
import QuickCreateModal from "./quick-create-modal";

type Icon = React.ComponentType<{ className?: string }>;

export function NavMain({
	items,
	setRecents,
}: {
	items: {
		title: string;
		url: string;
		icon: Icon;
	}[];
	setRecents: React.Dispatch<React.SetStateAction<any[]>>;
}) {
	const location = useLocation();
	const [quickCreateOpen, setQuickCreateOpen] = useState(false);
	return (
		<SidebarGroup>
			<SidebarGroupContent className="flex flex-col gap-2">
				<SidebarMenu>
					<SidebarMenuItem className="flex items-center gap-2">
						<SidebarMenuButton
							tooltip="Quick Create"
							className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear"
							onClick={() => setQuickCreateOpen(true)}
						>
							<Plus />
							<span>Quick Create</span>
						</SidebarMenuButton>
						<Button
							size="icon"
							className="size-8 group-data-[collapsible=icon]:opacity-0"
							variant="outline"
						>
							<Mail />
							<span className="sr-only">Inbox</span>
						</Button>
					</SidebarMenuItem>
				</SidebarMenu>
				<SidebarMenu>
					{items.map(item => {
						const isActive = location.pathname === item.url;
						return (
							<SidebarMenuItem key={item.title}>
								<SidebarMenuButton
									tooltip={item.title}
									isActive={isActive}
									asChild
								>
									<a href={item.url}>
										<item.icon />
										<span>{item.title}</span>
									</a>
								</SidebarMenuButton>
							</SidebarMenuItem>
						);
					})}
				</SidebarMenu>
			</SidebarGroupContent>
			<QuickCreateModal
				open={quickCreateOpen}
				onOpenChange={setQuickCreateOpen}
				setRecents={setRecents}
			/>
		</SidebarGroup>
	);
}
