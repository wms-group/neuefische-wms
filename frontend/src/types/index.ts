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

export interface CategoryOutputDTO {
    id: string;
    name: string;
    parentId: string | null;
}

export function isCategoryOutputDTO(obj: unknown): obj is CategoryOutputDTO {
    return typeof obj === "object" && obj !== null &&
        "id" in obj && "name" in obj && "parentId" in obj &&
        typeof obj.id === "string" &&
        typeof obj.name === "string" &&
        (
            typeof obj.parentId === "string" ||
            obj.parentId === null
        );
}

export interface CategoryInputDTO {
    name: string;
    parentId?: string | null;
}

export interface SelectOption {
    label: string;
    value: string;
}

export interface SelectGroup {
    label: string;
    options: SelectOption[];
}

export interface ErrorDTO {
    error: string;
    cause: string | null;
    causeMessage: string | null;
    message: string | null;
    status: string;
}

export function isErrorDTO(obj: unknown): obj is ErrorDTO {
    return typeof obj === "object" && obj !== null
        && "error" in obj && typeof obj.error === "string"
        && "cause" in obj && (typeof obj.cause === "string" || obj.cause === null)
        && "causeMessage" in obj && (typeof obj.causeMessage === "string" || obj.causeMessage === null)
        && "message" in obj && (typeof obj.message === "string" || obj.message === null)
        && "status" in obj && typeof obj.status === "string";
}