import { Plus } from "lucide-react";
import { useLocation } from "react-router";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { useQuickCreate } from "~/contexts/QuickCreateContext";
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
	const {
		isOpen: quickCreateOpen,
		openModal,
		setIsOpen: setQuickCreateOpen,
	} = useQuickCreate();
	const [isMac, setIsMac] = useState(false);

	useEffect(() => {
		setIsMac(navigator.platform.includes("Mac"));
	}, []);
	return (
		<SidebarGroup>
			<SidebarGroupContent className="flex flex-col gap-2">
				<SidebarMenu>
					<SidebarMenuItem className="flex items-center gap-2">
						<SidebarMenuButton
							tooltip={`Quick Create (${
								isMac ? "⌘K" : "Ctrl+K"
							})`}
							className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear"
							onClick={openModal}
						>
							<Plus />
							<span>Quick Create</span>
							<kbd className="ml-auto px-2 py-1 text-xs font-mono bg-black/20 border border-white/20 rounded shadow-sm">
								{isMac ? "⌘K" : "Ctrl+K"}
							</kbd>
						</SidebarMenuButton>
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
