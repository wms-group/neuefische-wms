import {ChangeEvent, ComponentType, PropsWithChildren, type ReactNode} from "react";
import {LucideProps} from "lucide-react";

export interface SideBarNavItem {
    link: string;
    path: string;
    icon: ComponentType<LucideProps>;
}

export interface SidebarConfig {
    sidebarHeader: {
        logo: string | ReactNode;
    }
    sidebarNavItems: SideBarNavItem[];
}

export interface SidebarComponentProps {
    sidebarItems: SidebarConfig;
}

export type SidebarContextType = {
    isOpen: boolean;
    toggleSidebar: () => void;
    closeSidebar: () => void;
}

export interface FooterConfig {
    showFullYear: boolean;
    company: string;
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
    btnClassName?: string;
};

export enum Role {
    ADMIN = "ADMIN",
    MANAGER = "MANAGER",
    CLERK = "CLERK",
}

export type UserDto = {
    id?: string;
    username: string;
    name: string;
    role: Role;
    password?: string;
};

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

export interface ProductOutputDTO {
    id: string;
    name: string;
    categoryId: string;
    price: string;
}

export function isProductOutputDTO(obj: unknown): obj is ProductOutputDTO {
    return typeof obj === "object" && obj !== null &&
        "id" in obj && "name" in obj && "categoryId" in obj && "price" in obj &&
        typeof obj.id === "string" &&
        typeof obj.name === "string" &&
        typeof obj.categoryId === "string" &&
        typeof obj.price === "string";
}

export interface ProductInputDTO {
    name: string;
    categoryId: string;
    price: string;
}

export interface SelectOption {
    label: string;
    value: string;
}

export interface SelectGroup {
    label: string;
    options: SelectOption[];
}

export interface Hall {
  id: string;
  name: string;
  aisleIds: string[];
}

export interface HallContextType {
  halls: Hall[];
  isLoading: boolean;
  error: string | null;
  fetchHalls: () => Promise<void>;
  addHall: (hall: Omit<Hall, 'id'>) => Promise<void>;
  updateHall: (updatedHall: Partial<Hall>) => Promise<void>;
  removeHall: (id: string) => Promise<void>;
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

export type SelectProps<T extends string | number> = {
    label: string;
    description?: string;
    options: T[];
    value: T;
    onChange: (value: T) => void;
    disabled?: boolean;
    className?: string;
};

export type InputWithLabelProps = {
    label: string
    name: string
    value: string
    onChange: (e: ChangeEvent<HTMLInputElement>) => void
    onBlur: (e: ChangeEvent<HTMLInputElement>) => void
    type?: string
    placeholder?: string
    required?: boolean
    className?: string
    error?: string
    disabled?: boolean
}

export type GridLayoutProps = {
    children: ReactNode;
    className?: string;
    gap?: string;
    gridCols: Partial<{
        base: number;
        sm: number;
        md: number;
        lg: number;
        xl: number;
        '2xl'?: number;
    }>
}