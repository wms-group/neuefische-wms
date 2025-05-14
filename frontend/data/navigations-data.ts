import {Box, CheckCircle, ClipboardList, Home} from "lucide-react";
import {FooterConfig, SidebarConfig} from "@/types";

export const sidebarItemsConfig: SidebarConfig = {
    defaultOpen: true,
    logo: "LOGO",
    sidebarNavItems: [
        {
            link: "dashboard",
            path: "/",
            icon: Home
        },
        {
            link: "products",
            path: "/products",
            icon: Box
        },
        {
            link: "orders",
            path: "/orders",
            icon: ClipboardList
        },
        {
            link: "hall",
            path: "/status/done",
            icon: CheckCircle
        },
    ],
};


export const footerConfig: FooterConfig = {
    showFullYear: true,
    company: "wms.group",
};
