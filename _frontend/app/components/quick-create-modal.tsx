import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { Button } from "./ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "./ui/dialog";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Link2 } from "lucide-react";
import { shortenUrl } from "~/api/home";
import { useSessionStorage } from "usehooks-ts";

const FormSchema = z.object({
	url: z.string().url({
		message: "Please enter a valid URL.",
	}),
});

interface RecentEntry {
	alias: string;
	longURL: string;
	createTime: string;
}

interface QuickCreateModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	setRecents: React.Dispatch<React.SetStateAction<RecentEntry[]>>;
}

const QuickCreateModal = ({
	open,
	onOpenChange,
	setRecents,
}: QuickCreateModalProps) => {
	const [recent, setRecent] = useSessionStorage<RecentEntry | undefined>(
		"recent",
		undefined
	);

	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			url: "",
		},
	});

	async function onSubmit(data: z.infer<typeof FormSchema>) {
		toast.promise(shortenUrl({ longURL: data.url, alias: "" }), {
			loading: "Shortening URL...",
			success: (res: { data: RecentEntry }) => {
				setRecent(res.data);
				setRecents((r: RecentEntry[]) => [...r, res.data]);
				onOpenChange(false);
				form.reset();
				return "URL shortened successfully!";
			},
			error: "Failed to shorten URL",
		});
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Quick Create Short URL</DialogTitle>
					<DialogDescription>
						Enter a long URL to create a short, shareable link
						instantly.
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-4"
						noValidate
					>
						<FormField
							control={form.control}
							name="url"
							render={({ field }: { field: any }) => (
								<FormItem>
									<FormLabel>
										<Link2 className="inline mr-2 h-4 w-4" />
										Long URL
									</FormLabel>
									<FormControl>
										<Input
											placeholder="https://example.com/very-long-url"
											type="url"
											{...field}
										/>
									</FormControl>
									<FormDescription>
										Enter the URL you want to shorten.
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className="flex justify-end gap-2">
							<Button
								type="button"
								variant="outline"
								onClick={() => onOpenChange(false)}
							>
								Cancel
							</Button>
							<Button type="submit">Create Short URL</Button>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};

export default QuickCreateModal;
