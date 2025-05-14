import {ComponentType, PropsWithChildren, type ReactNode} from "react";
import {LucideProps} from "lucide-react";

export interface SideBarNavItem {
    link: string;
    path: string;
    icon: ComponentType<LucideProps>;
}


export interface SidebarConfig {
    defaultOpen: boolean;
    sidebarHeader: {
        logo: string | ReactNode;
    }
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

export enum ButtonType {
    button = "button",
    submit = "submit",
    reset = "reset",
}

export type ButtonProps = {
    className?: string;
    onClick?: () => void;
    type?: ButtonType
    children?: ReactNode;
    label?: string;
    disabled?: boolean;
    iconOnly?: boolean;
    iconAfter?: ReactNode;
    iconBefore?: ReactNode;
}


export type UserAvatarProps = {
    userName: string;
    onLogout?: () => void;
};