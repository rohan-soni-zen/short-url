import {
	BookOpen,
	ChartSpline,
	HelpCircleIcon,
	Home,
	Search,
	Settings,
	Zap,
} from "lucide-react";
import { NavMain } from "./nav-main";
import { NavSecondary } from "./nav-secondary";
import { NavUser } from "./nav-user";

interface RecentEntry {
	alias: string;
	longURL: string;
	createTime: string;
}
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "./ui/sidebar";

const data = {
	user: {
		name: "Rohan Sony",
		email: "rohansony8873@gmail.com",
		avatar: "/avatars/shadcn.jpg",
	},
	navMain: [
		{
			title: "Home",
			url: "/",
			icon: Home,
		},
		{
			title: "Stats",
			url: "/stats",
			icon: ChartSpline,
		},
		{
			title: "How it works?",
			url: "/about",
			icon: BookOpen,
		},
	],
	navSecondary: [
		{
			title: "Settings",
			url: "/settings",
			icon: Settings,
		},
		{
			title: "Get Help",
			url: "/help",
			icon: HelpCircleIcon,
		},
		{
			title: "Search",
			url: "/search",
			icon: Search,
		},
	],
};

export function AppSidebar({
	setRecents,
	...props
}: React.ComponentProps<typeof Sidebar> & {
	setRecents: React.Dispatch<React.SetStateAction<RecentEntry[]>>;
}) {
	return (
		<Sidebar collapsible="icon" {...props}>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton
							asChild
							className="data-[slot=sidebar-menu-button]:!p-1.5"
						>
							<a href="/">
								<Zap className="!size-5" />
								<span className="text-base font-semibold">
									Short URL
								</span>
							</a>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				<NavMain items={data.navMain} setRecents={setRecents} />
				<NavSecondary items={data.navSecondary} className="mt-auto" />
			</SidebarContent>
			<SidebarFooter>
				<NavUser user={data.user} />
			</SidebarFooter>
		</Sidebar>
	);
}
