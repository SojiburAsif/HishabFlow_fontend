import { Home } from "lucide-react";
import type { Route } from "@/types/Router.type";

export const ShopOwnerRouters: Route[] = [
	{
		title: "Dashboard",
		items: [{ title: "Home", url: "/dashboard", icon: Home }],
	},
];
