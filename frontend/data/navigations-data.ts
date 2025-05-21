import {FooterConfig, SidebarConfig} from "@/types";
import {Box, ClipboardList, Columns3Icon, ContainerIcon, Folders, LayoutDashboardIcon,} from "lucide-react";

export const sidebarItemsConfig: SidebarConfig = {
    sidebarHeader: {
        logo: "LOGO",
    },
    sidebarNavItems: [
        {
            link: "dashboard",
            path: "/",
            icon: LayoutDashboardIcon
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
            link: "halls",
            path: "/halls",
            icon: Columns3Icon,
        },
        {
            link: "stock",
            path: "/stock",
            icon: ContainerIcon
        }
    ],
};


export const footerConfig: FooterConfig = {
    showFullYear: true,
    company: "wms-group.tech",
};
