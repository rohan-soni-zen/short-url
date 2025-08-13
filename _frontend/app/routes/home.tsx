import { useOutletContext } from "react-router";
import { useRef } from "react";
import { BookOpen } from "lucide-react";
import Recents from "~/components/recents";
import URLForm from "~/components/url-form";
import type { URLFormRef } from "~/components/url-form";
import type { Route } from "./+types/home";

interface RecentEntry {
	alias: string;
	longURL: string;
	createTime: string;
}

export function meta({}: Route.MetaArgs) {
	return [
		{ title: "Short URL" },
		{ name: "description", content: "Welcome to Short URL!" },
	];
}

export default function Home() {
	const { recents, setRecents } = useOutletContext<{
		recents: RecentEntry[];
		setRecents: React.Dispatch<React.SetStateAction<RecentEntry[]>>;
	}>();

	const urlFormRef = useRef<URLFormRef>(null);

	return (
		<div className="flex flex-col h-full overflow-hidden">
			{/* Info Banner */}
			<div className="bg-blue-50 dark:bg-blue-950/20 border-b border-blue-200 dark:border-blue-800 px-8 py-3">
				<div className="flex items-center justify-center gap-2 text-sm text-blue-700 dark:text-blue-300">
					<BookOpen className="h-4 w-4" />
					<span>New to Short-URL? </span>
					<a
						href="/about"
						className="font-medium underline hover:text-blue-800 dark:hover:text-blue-200 transition-colors"
					>
						Learn how it works
					</a>
				</div>
			</div>

			{/* Main Content */}
			<div className="flex flex-col lg:flex-row h-full gap-8 p-8 overflow-hidden">
				<div className="w-full lg:w-1/2 overflow-y-auto">
					<URLForm ref={urlFormRef} setRecents={setRecents} />
				</div>
				<div className="w-full lg:w-1/2 overflow-y-auto">
					<Recents
						recents={recents}
						setRecents={setRecents}
						clearRecent={() => urlFormRef.current?.clearRecent()}
					/>
				</div>
			</div>
		</div>
	);
}
