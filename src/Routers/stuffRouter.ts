import { Home } from "lucide-react";
import { ShoppingCart, Users, Settings } from "lucide-react";
import type { Route } from "@/types/Router.type";

export const StaffRouters: Route[] = [
	{
		title: "Dashboard",
		items: [
			{ title: "Overview", url: "/dashboard/overview", icon: Home },
			{ title: "Orders", url: "/dashboard/orders", icon: ShoppingCart },
			{ title: "Customers", url: "/dashboard/staff", icon: Users },
			{ title: "Settings", url: "/dashboard/settings", icon: Settings },
		],
	},
];
