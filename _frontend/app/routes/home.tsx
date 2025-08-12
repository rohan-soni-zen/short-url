import { useOutletContext } from "react-router";
import { useRef } from "react";
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
	);
}
