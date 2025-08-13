import { useEffect, useRef, useState } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Separator } from "~/components/ui/separator";
import {
	ExternalLink,
	Zap,
	Shield,
	BarChart3,
	Database,
	Code2,
	Rocket,
	Loader2,
	AlertCircle,
} from "lucide-react";
import mermaid from "mermaid";

// Custom styles for Mermaid diagrams
const mermaidStyles = `
  .mermaid {
    font-family: 'Inter', system-ui, sans-serif !important;
  }
  
  .mermaid svg {
    max-width: 100% !important;
    height: auto !important;
  }
  
  .mermaid .node rect,
  .mermaid .node circle,
  .mermaid .node ellipse,
  .mermaid .node polygon {
    stroke-width: 2px !important;
  }
  
  .mermaid .label {
    font-family: 'Inter', system-ui, sans-serif !important;
    font-size: 14px !important;
  }
  
  .mermaid .cluster rect {
    stroke-width: 2px !important;
    rx: 8px !important;
  }
  
  .mermaid .cluster .label {
    font-weight: 600 !important;
  }
`;

const About = () => {
	const mermaidRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [loadingDiagrams, setLoadingDiagrams] = useState<string[]>([]);

	useEffect(() => {
		// Inject custom styles
		const styleElement = document.createElement("style");
		styleElement.textContent = mermaidStyles;
		document.head.appendChild(styleElement);

		const loadMermaid = async () => {
			try {
				setIsLoading(true);
				setError(null);

				// Initialize Mermaid
				mermaid.initialize({
					startOnLoad: false,
					theme: "default",
					securityLevel: "loose",
					fontFamily: "Inter, system-ui, sans-serif",
					themeVariables: {
						primaryColor: "#3b82f6",
						primaryTextColor: "#1f2937",
						primaryBorderColor: "#3b82f6",
						lineColor: "#6b7280",
						secondaryColor: "#f3f4f6",
						tertiaryColor: "#e5e7eb",
					},
				});

				// Render all diagrams
				const diagrams = [
					{
						id: "architecture",
						text: `
graph TB
    subgraph "Frontend (React)"
        A[User Browser] --> B[React Router]
        B --> C[Home Route]
        B --> D[Stats Route]
        B --> E[Auth Routes]
        C --> F[URL Form]
        D --> G[Charts & Tables]
        E --> H[Login/Register]
    end
    
    subgraph "Backend (Node.js)"
        I[Express Server] --> J[Auth Service]
        I --> K[URL Service]
        I --> L[Stats Service]
        I --> M[Click Tracking]
    end
    
    subgraph "Database"
        N[(TypeORM)]
        N --> O[User Table]
        N --> P[URL Table]
        N --> Q[Click Table]
    end
    
    A --> I
    I --> N
						`,
					},
					{
						id: "create-flow",
						text: `
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant B as Backend
    participant D as Database
    
    U->>F: Enter long URL + alias
    F->>F: Validate input
    F->>B: POST /?longURL&alias
    Note over B: Add x-user-id/email if authenticated
    B->>B: Generate/validate alias
    B->>D: Save URL record
    D-->>B: URL saved
    B-->>F: 201 JSON response
    F->>F: Update recents (localStorage)
    F->>U: Show success toast
						`,
					},
					{
						id: "redirect-flow",
						text: `
sequenceDiagram
    participant U as User
    participant B as Backend
    participant D as Database
    
    U->>B: GET /:alias
    B->>D: Find URL by alias
    D-->>B: URL record
    B->>D: Create Click record
    D-->>B: Click saved
    B-->>U: 302 redirect to longURL
						`,
					},
					{
						id: "auth-flow",
						text: `
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant B as Backend
    participant D as Database
    
    U->>F: Click Login/Register
    F->>F: Open modal
    U->>F: Enter credentials
    F->>B: POST /api/auth/login
    B->>D: Validate user
    D-->>B: User data
    B-->>F: Auth response
    F->>F: Store in AuthContext
    F->>F: Close modal
    F->>U: Show success
						`,
					},
					{
						id: "stats-flow",
						text: `
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant B as Backend
    participant D as Database
    
    U->>F: Navigate to /stats
    F->>B: GET /stats/url/:days
    F->>B: GET /stats/click/:days
    F->>B: GET /stats/top/:days/:count
    
    B->>D: QueryBuilder aggregations
    D-->>B: Aggregated data
    B-->>F: JSON responses
    
    F->>F: React Query cache
    F->>F: Render charts & tables
    F->>U: Display analytics
						`,
					},
					{
						id: "database-schema",
						text: `
erDiagram
    User {
        int id PK
        string name
        string email UK
        string password
        datetime createdAt
        datetime updatedAt
    }
    
    URL {
        int id PK
        string alias UK
        string longURL
        datetime createTime
        int userId FK
    }
    
    Click {
        int id PK
        string alias
        datetime clickTime
        int urlId FK
    }
    
    User ||--o{ URL : creates
    URL ||--o{ Click : receives
						`,
					},
				];

				for (const diagram of diagrams) {
					try {
						setLoadingDiagrams(prev => [...prev, diagram.id]);

						if (mermaidRefs.current[diagram.id]) {
							// Small delay to ensure DOM is ready
							await new Promise(resolve =>
								setTimeout(resolve, 100)
							);

							const { svg } = await mermaid.render(
								diagram.id,
								diagram.text
							);
							if (mermaidRefs.current[diagram.id]) {
								mermaidRefs.current[diagram.id]!.innerHTML =
									svg;
								// Add mermaid class for styling
								mermaidRefs.current[diagram.id]!.classList.add(
									"mermaid"
								);
							}
						}

						setLoadingDiagrams(prev =>
							prev.filter(id => id !== diagram.id)
						);
					} catch (error) {
						console.error(
							`Error rendering diagram ${diagram.id}:`,
							error
						);
						// Show error message in the diagram container
						if (mermaidRefs.current[diagram.id]) {
							mermaidRefs.current[diagram.id]!.innerHTML = `
								<div class="text-center text-red-500 p-4">
									<AlertCircle class="h-8 w-8 mx-auto mb-2" />
									<p class="text-sm">Failed to load diagram</p>
								</div>
							`;
						}
						setLoadingDiagrams(prev =>
							prev.filter(id => id !== diagram.id)
						);
					}
				}

				setIsLoading(false);
			} catch (err) {
				setError("Failed to load diagrams. Please refresh the page.");
				setIsLoading(false);
				console.error("Mermaid loading error:", err);
			}
		};

		// Load diagrams after component mounts
		loadMermaid();

		// Cleanup styles on unmount
		return () => {
			document.head.removeChild(styleElement);
		};
	}, []);

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
			"MySQL/PostgreSQL",
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

	if (error) {
		return (
			<div className="container mx-auto px-4 py-8 max-w-7xl">
				<div className="text-center">
					<AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
					<h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
						Something went wrong
					</h1>
					<p className="text-gray-600 dark:text-gray-300 mb-4">
						{error}
					</p>
					<button
						onClick={() => window.location.reload()}
						className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
					>
						Refresh Page
					</button>
				</div>
			</div>
		);
	}

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
					{loadingDiagrams.includes("architecture") ? (
						<div className="flex justify-center items-center h-64">
							<Loader2 className="h-8 w-8 animate-spin text-blue-600" />
						</div>
					) : (
						<div
							ref={el => {
								mermaidRefs.current.architecture = el;
							}}
							className="flex justify-center w-full overflow-x-auto"
							id="architecture"
						/>
					)}
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
						{loadingDiagrams.includes("create-flow") ? (
							<div className="flex justify-center items-center h-48">
								<Loader2 className="h-6 w-6 animate-spin text-blue-600" />
							</div>
						) : (
							<div
								ref={el => {
									mermaidRefs.current["create-flow"] = el;
								}}
								className="flex justify-center w-full overflow-x-auto"
								id="create-flow"
							/>
						)}
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
						{loadingDiagrams.includes("redirect-flow") ? (
							<div className="flex justify-center items-center h-48">
								<Loader2 className="h-6 w-6 animate-spin text-blue-600" />
							</div>
						) : (
							<div
								ref={el => {
									mermaidRefs.current["redirect-flow"] = el;
								}}
								className="flex justify-center w-full overflow-x-auto"
								id="redirect-flow"
							/>
						)}
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
						{loadingDiagrams.includes("auth-flow") ? (
							<div className="flex justify-center items-center h-48">
								<Loader2 className="h-6 w-6 animate-spin text-blue-600" />
							</div>
						) : (
							<div
								ref={el => {
									mermaidRefs.current["auth-flow"] = el;
								}}
								className="flex justify-center w-full overflow-x-auto"
								id="auth-flow"
							/>
						)}
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
						{loadingDiagrams.includes("stats-flow") ? (
							<div className="flex justify-center items-center h-48">
								<Loader2 className="h-6 w-6 animate-spin text-blue-600" />
							</div>
						) : (
							<div
								ref={el => {
									mermaidRefs.current["stats-flow"] = el;
								}}
								className="flex justify-center w-full overflow-x-auto"
								id="stats-flow"
							/>
						)}
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
					{loadingDiagrams.includes("database-schema") ? (
						<div className="flex justify-center items-center h-64">
							<Loader2 className="h-8 w-8 animate-spin text-blue-600" />
						</div>
					) : (
						<div
							ref={el => {
								mermaidRefs.current["database-schema"] = el;
							}}
							className="flex justify-center w-full overflow-x-auto"
							id="database-schema"
						/>
					)}
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
