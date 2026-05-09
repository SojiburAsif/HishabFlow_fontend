
import {
    Home,
    ClipboardList,
    ShieldUser,
    BarChart3,
    BadgeDollarSign,
} from "lucide-react";
import type { Route } from "@/types/Router.type";

export const AdminRouters: Route[] = [
    {
        title: "Dashboard",
        items: [
            { title: "Overview", url: "/dashboard/admin", icon: Home },
            { title: "Users", url: "/dashboard/admin/users", icon: ShieldUser },
            { title: "Sessions", url: "/dashboard/admin/sessions", icon: ClipboardList },
            { title: "Payments", url: "/dashboard/admin/payments", icon: BadgeDollarSign },
            { title: "Subscriptions", url: "/dashboard/admin/subscriptions", icon: BarChart3 },
        ],
    }
];