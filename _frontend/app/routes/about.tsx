import {
	BarChart3,
	Code2,
	Database,
	ExternalLink,
	Rocket,
	Shield,
	Zap,
} from "lucide-react";
import { Badge } from "~/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "~/components/ui/card";

const About = () => {
	const features = [
		{
			icon: Zap,
			title: "Lightning Fast",
			description:
				"Instant URL shortening with real-time processing and caching",
		},
		{
			icon: Shield,
			title: "Secure & Reliable",
			description:
				"Password hashing, JWT authentication, and input validation",
		},
		{
			icon: BarChart3,
			title: "Analytics Dashboard",
			description:
				"Comprehensive click tracking and performance insights",
		},
		{
			icon: Database,
			title: "Scalable Architecture",
			description: "TypeORM with efficient query builders and indexing",
		},
		{
			icon: Code2,
			title: "Modern Tech Stack",
			description: "React 18, Node.js, TypeScript, and Tailwind CSS",
		},
		{
			icon: Rocket,
			title: "Production Ready",
			description:
				"Docker support, environment configs, and deployment guides",
		},
	];

	const techStack = {
		frontend: [
			"React 18",
			"React Router",
			"Vite",
			"React Query",
			"Shadcn/ui",
			"Tailwind CSS",
			"Recharts",
			"React Hook Form",
			"Zod",
		],
		backend: [
			"Node.js",
			"Express",
			"TypeORM",
			"TypeScript",
			"class-validator",
			"node-cron",
			"bcrypt",
			"JWT",
		],
		database: [
			"SQLite",
			"TypeORM Entities",
			"Query Builders",
			"Relationships",
			"Indexing",
		],
		deployment: [
			"Docker",
			"Kubernetes",
			"Environment Variables",
			"Production Builds",
			"Static Asset Serving",
		],
	};

	return (
		<div className="container mx-auto px-4 py-8 max-w-7xl">
			{/* System Overview */}
			<Card className="mb-8">
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Code2 className="h-5 w-5" />
						System Architecture Overview
					</CardTitle>
					<CardDescription>
						High-level view of how the frontend, backend, and
						database interact
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="flex justify-center w-full overflow-x-auto">
						<img
							src="/diagrams/architecture.svg"
							alt="System Architecture Diagram"
							className="max-w-full h-auto"
						/>
					</div>
				</CardContent>
			</Card>

			{/* Flow Diagrams */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Zap className="h-5 w-5" />
							Create Short URL Flow
						</CardTitle>
						<CardDescription>
							Complete journey from user input to successful URL
							creation
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="flex justify-center w-full overflow-x-auto">
							<img
								src="/diagrams/create-flow.svg"
								alt="Create Short URL Flow"
								className="max-w-full h-auto"
							/>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Rocket className="h-5 w-5" />
							URL Redirect Flow
						</CardTitle>
						<CardDescription>
							How short URLs redirect users while tracking clicks
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="flex justify-center w-full overflow-x-auto">
							<img
								src="/diagrams/redirect-flow.svg"
								alt="URL Redirect Flow"
								className="max-w-full h-auto"
							/>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Shield className="h-5 w-5" />
							Authentication Flow
						</CardTitle>
						<CardDescription>
							Secure user login and registration process
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="flex justify-center w-full overflow-x-auto">
							<img
								src="/diagrams/auth-flow.svg"
								alt="Authentication Flow"
								className="max-w-full h-auto"
							/>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<BarChart3 className="h-5 w-5" />
							Analytics Flow
						</CardTitle>
						<CardDescription>
							How statistics are collected and displayed
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="flex justify-center w-full overflow-x-auto">
							<img
								src="/diagrams/stats-flow.svg"
								alt="Analytics Flow"
								className="max-w-full h-auto"
							/>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Database Schema */}
			<Card className="mb-8">
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Database className="h-5 w-5" />
						Database Schema
					</CardTitle>
					<CardDescription>
						Entity relationships and data structure
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="flex justify-center w-full overflow-x-auto">
						<img
							src="/diagrams/database-schema.svg"
							alt="Database Schema"
							className="max-w-full h-auto"
						/>
					</div>
				</CardContent>
			</Card>

			{/* Key Features */}
			<Card className="mb-8">
				<CardHeader>
					<CardTitle>Key Features & Capabilities</CardTitle>
					<CardDescription>
						What makes our URL shortening service stand out
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{features.map((feature, index) => (
							<div key={index} className="flex items-start gap-3">
								<div className="flex-shrink-0 w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
									<feature.icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
								</div>
								<div>
									<h3 className="font-semibold text-gray-900 dark:text-white mb-1">
										{feature.title}
									</h3>
									<p className="text-sm text-gray-600 dark:text-gray-300">
										{feature.description}
									</p>
								</div>
							</div>
						))}
					</div>
				</CardContent>
			</Card>

			{/* Tech Stack */}
			<Card className="mb-8">
				<CardHeader>
					<CardTitle>Technology Stack</CardTitle>
					<CardDescription>
						Modern tools and frameworks powering our application
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
						{Object.entries(techStack).map(
							([category, technologies]) => (
								<div key={category}>
									<h3 className="font-semibold text-gray-900 dark:text-white mb-3 capitalize">
										{category}
									</h3>
									<div className="space-y-2">
										{technologies.map((tech, index) => (
											<Badge
												key={index}
												variant="secondary"
												className="mr-2 mb-2"
											>
												{tech}
											</Badge>
										))}
									</div>
								</div>
							)
						)}
					</div>
				</CardContent>
			</Card>

			{/* Performance & Scalability */}
			<Card className="mb-8">
				<CardHeader>
					<CardTitle>Performance & Scalability</CardTitle>
					<CardDescription>
						How we ensure fast, reliable service at scale
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div>
							<h3 className="font-semibold text-gray-900 dark:text-white mb-3">
								Frontend Optimization
							</h3>
							<ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
								<li>
									• React Query for efficient data fetching
									and caching
								</li>
								<li>
									• Code splitting and lazy loading with React
									Router
								</li>
								<li>
									• Optimized bundle with Vite build tooling
								</li>
								<li>
									• Responsive design with Tailwind CSS
									utilities
								</li>
							</ul>
						</div>
						<div>
							<h3 className="font-semibold text-gray-900 dark:text-white mb-3">
								Backend Performance
							</h3>
							<ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
								<li>
									• TypeORM query builders for optimized
									database queries
								</li>
								<li>
									• Efficient indexing on alias and user_id
									fields
								</li>
								<li>
									• Connection pooling and transaction
									management
								</li>
								<li>
									• Scheduled tasks with node-cron for
									maintenance
								</li>
							</ul>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Call to Action */}
			<Card className="text-center">
				<CardContent className="pt-6">
					<h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
						Ready to Get Started?
					</h3>
					<p className="text-gray-600 dark:text-gray-300 mb-4">
						Try our URL shortening service or explore the codebase
					</p>
					<div className="flex flex-col sm:flex-row gap-3 justify-center">
						<a
							href="/"
							className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
						>
							<Rocket className="h-4 w-4" />
							Try URL Shortener
						</a>
						<a
							href="https://github.com/rohan-soni-zen/short-url"
							target="_blank"
							rel="noopener noreferrer"
							className="inline-flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
						>
							<ExternalLink className="h-4 w-4" />
							View on GitHub
						</a>
					</div>
				</CardContent>
			</Card>
		</div>
	);
};

export default About;
