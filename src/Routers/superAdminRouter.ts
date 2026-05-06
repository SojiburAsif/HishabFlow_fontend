
import {
    Home,
} from "lucide-react";
import type { Route } from "@/types/Router.type";

export const AdminRouters: Route[] = [
    {
        title: "Dashboard",
        items: [
            { title: "Home", url: "/dashboard", icon: Home },
        ],
    }
];