import {Box, ClipboardList, Columns3Icon, Home} from "lucide-react";
import {FooterConfig, SidebarConfig} from "@/types";

export const sidebarItemsConfig: SidebarConfig = {
    sidebarHeader: {
        logo: "LOGO",
    },
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
            link: "halls",
            path: "/halls",
            icon: Columns3Icon,
        },
    ],
};


export const footerConfig: FooterConfig = {
    showFullYear: true,
    company: "wms-group.tech",
};
