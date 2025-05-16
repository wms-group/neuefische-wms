import {Box, CheckCircle, ClipboardList, Folders, Home} from "lucide-react";
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
            link: "categories",
            path: "/categories",
            icon: Folders
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
            path: "/halls",
            icon: CheckCircle
        },
    ],
};


export const footerConfig: FooterConfig = {
    showFullYear: true,
    company: "wms.group",
};
