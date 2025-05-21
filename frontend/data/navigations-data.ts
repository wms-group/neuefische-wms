import {FooterConfig, SidebarConfig} from "@/types";
import {Box, ClipboardList, Columns3Icon, ContainerIcon, LayoutDashboardIcon} from "lucide-react";
import wms from "/wms.png"

export const sidebarItemsConfig: SidebarConfig = {
    sidebarHeader: {
        logoPath: wms,
    },
    sidebarNavItems: [
        {
            link: "dashboard",
            path: "/",
            icon: LayoutDashboardIcon
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
