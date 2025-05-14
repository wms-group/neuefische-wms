import {ComponentType, PropsWithChildren, type ReactNode} from "react";
import {LucideProps} from "lucide-react";

export interface SideBarNavItem {
    link: string;
    path: string;
    icon: ComponentType<LucideProps>;
}


export interface SidebarConfig {
    defaultOpen: boolean;
    logo: string | ReactNode;
    sidebarNavItems: SideBarNavItem[];
}

export interface FooterConfig {
    showFullYear: boolean;
    company: string;
}


export interface SidebarComponentProps {
    sidebarItems: SidebarConfig;
}

export interface FooterComponentProps {
    footerItems: FooterConfig;
}

export interface ILayoutContainer extends PropsWithChildren {
    className?: string;
}
