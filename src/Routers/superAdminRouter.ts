
import {
    Home,
    ClipboardList,
    ShieldUser,
    BarChart3,
    Settings,
    BadgeDollarSign,
} from "lucide-react";
import type { Route } from "@/types/Router.type";

export const AdminRouters: Route[] = [
    {
        title: "Dashboard",
        items: [
            { title: "Overview", url: "/dashboard/overview", icon: Home },
            { title: "Reports", url: "/dashboard/reports", icon: BarChart3 },
            { title: "Subscriptions", url: "/dashboard/subscriptions", icon: BadgeDollarSign },
            { title: "Staff", url: "/dashboard/staff", icon: ShieldUser },
            { title: "Orders", url: "/dashboard/orders", icon: ClipboardList },
            { title: "Settings", url: "/dashboard/settings", icon: Settings },
        ],
    }
];