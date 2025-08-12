import { zodResolver } from "@hookform/resolvers/zod";
import { Link2, SquareSlash } from "lucide-react";
import React, { useImperativeHandle, forwardRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { shortenUrl } from "~/api/home";
import { cn } from "~/lib/utils";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader } from "./ui/card";
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
import URLCardDetailed from "./url-card-detailed";
import { useSessionStorage } from "usehooks-ts";

const FormSchema = z.object({
	url: z.string().url({
		message: "Please enter a valid URL.",
	}),
	alias: z
		.string()
		.optional()
		.refine(
			val => {
				if (!val) return true;
				return /^[a-zA-Z0-9-_]+$/.test(val);
			},
			{
				message:
					"Alias can only contain letters, numbers, hyphens, and underscores.",
			}
		),
});

interface RecentEntry {
	alias: string;
	longURL: string;
	createTime: string;
}

interface URLFormProps extends React.ComponentPropsWithoutRef<"div"> {
	setRecents: React.Dispatch<React.SetStateAction<RecentEntry[]>>;
}

export interface URLFormRef {
	clearRecent: () => void;
}

const URLForm = forwardRef<URLFormRef, URLFormProps>(
	({ className, setRecents, ...props }, ref) => {
		const form = useForm<z.infer<typeof FormSchema>>({
			resolver: zodResolver(FormSchema),
			defaultValues: {
				url: "",
				alias: "",
			},
		});

		const [recent, setRecent] = useSessionStorage<RecentEntry | undefined>(
			"recent",
			undefined
		);

		useImperativeHandle(ref, () => ({
			clearRecent: () => setRecent(undefined),
		}));

		async function onSubmit(data: z.infer<typeof FormSchema>) {
			toast.promise(
				shortenUrl({ longURL: data.url, alias: data.alias }),
				{
					loading: "Shortening URL...",
					success: (res: { data: RecentEntry }) => {
						setRecent(res.data);
						setRecents((r: RecentEntry[]) => [
							...r.slice(),
							res.data,
						]);
						return "URL shortened successfully!";
					},
					error: (err: any) => {
						return (
							err.response?.data?.error || "Failed to shorten URL"
						);
					},
				}
			);
		}

		return (
			<div className="flex flex-col gap-8 h-full">
				<div
					className={cn("flex flex-col gap-6", className)}
					{...props}
				>
					<span className="text-xl font-bold">URL Shortener</span>
					<Card className="w-full">
						<CardHeader>
							<CardDescription>
								Enter a long URL to create a short, shareable
								link
							</CardDescription>
						</CardHeader>
						<CardContent>
							<Form {...form}>
								<form
									onSubmit={form.handleSubmit(onSubmit)}
									className="space-y-6"
									noValidate
								>
									<FormField
										control={form.control}
										name="url"
										render={({ field }: { field: any }) => (
											<FormItem>
												<FormLabel>
													<Link2 />
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
													Enter the URL you want to
													shorten.
												</FormDescription>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="alias"
										render={({ field }: { field: any }) => (
											<FormItem>
												<FormLabel>
													<SquareSlash />
													Custom Alias (Optional)
												</FormLabel>
												<FormControl>
													<Input
														placeholder="my-custom-link"
														{...field}
													/>
												</FormControl>
												<FormDescription>
													Create a custom short URL.
													Leave empty for
													auto-generated.
												</FormDescription>
												<FormMessage />
											</FormItem>
										)}
									/>
									<Button type="submit">Shorten URL</Button>
								</form>
							</Form>
						</CardContent>
					</Card>
				</div>
				{recent && <URLCardDetailed {...recent} />}
			</div>
		);
	}
);

URLForm.displayName = "URLForm";

export default URLForm;
