import { Home } from "lucide-react";
import type { Route } from "@/types/Router.type";

export const StaffRouters: Route[] = [
	{
		title: "Dashboard",
		items: [{ title: "Home", url: "/dashboard", icon: Home }],
	},
];
