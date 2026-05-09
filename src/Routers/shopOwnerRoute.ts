import { Home, BarChart3, Bell, Users, FileText, LogOut } from "lucide-react";
import { ShoppingCart, PackageSearch, Boxes, Settings, CreditCard, Gift } from "lucide-react";
import type { Route } from "@/types/Router.type";

export const ShopOwnerRouters: Route[] = [
	{
		title: "Main",
		items: [
			{ title: "Dashboard", url: "/dashboard/shop-owner", icon: Home },
		],
	},
	{
		title: "Sales & Orders",
		items: [
			{ title: "Orders", url: "/dashboard/orders", icon: ShoppingCart },
			{ title: "Payments", url: "/dashboard/payments", icon: CreditCard },
			{ title: "Receipts", url: "/dashboard/receipts", icon: FileText },
		],
	},
	{
		title: "Products & Inventory",
		items: [
			{ title: "Products", url: "/dashboard/products", icon: PackageSearch },
			{ title: "Inventory", url: "/dashboard/inventory", icon: Boxes },
		],
	},
	{
		title: "Management",
		items: [
			{ title: "Team Members", url: "/dashboard/team", icon: Users },
			{ title: "Reports", url: "/dashboard/reports", icon: BarChart3 },
			{ title: "Notifications", url: "/dashboard/notifications", icon: Bell },
		],
	},
	{
		title: "Account",
		items: [
			{ title: "Subscription", url: "/dashboard/subscriptions", icon: Gift },
			{ title: "Settings", url: "/dashboard/settings", icon: Settings },
		],
	},
];
