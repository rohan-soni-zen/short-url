import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
	index("routes/home.tsx"),
	route("/stats", "routes/stats.tsx"),
	route("/about", "routes/about.tsx"),
	route("*", "routes/404.tsx"),
] satisfies RouteConfig;
