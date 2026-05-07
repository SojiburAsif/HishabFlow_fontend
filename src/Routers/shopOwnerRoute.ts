import { Home } from "lucide-react";
import { ShoppingCart, PackageSearch, Boxes, Settings } from "lucide-react";
import type { Route } from "@/types/Router.type";

export const ShopOwnerRouters: Route[] = [
	{
		title: "Dashboard",
		items: [
			{ title: "Overview", url: "/dashboard/overview", icon: Home },
			{ title: "Orders", url: "/dashboard/orders", icon: ShoppingCart },
			{ title: "Products", url: "/dashboard/products", icon: PackageSearch },
			{ title: "Inventory", url: "/dashboard/inventory", icon: Boxes },
			{ title: "Settings", url: "/dashboard/settings", icon: Settings },
		],
	},
];
