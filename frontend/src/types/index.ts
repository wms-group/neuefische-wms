import {ChangeEvent, ComponentType, PropsWithChildren, type ReactNode} from "react";
import {LucideProps} from "lucide-react";

export interface SideBarNavItem {
    link: string;
    path: string;
    icon: ComponentType<LucideProps>;
}

export interface SidebarConfig {
    sidebarHeader: {
        logoPath?: string;
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

export enum UserRole {
    ADMIN = "ADMIN",
    MANAGER = "MANAGER",
    CLERK = "CLERK",
}

export type UserDto = {
    id: string;
    username: string;
    name: string;
    role: UserRole;
    password?: string;
};

export interface CategoryOutputDTO {
    id: string;
    name: string;
    parentId: string | null;
    countSubCategories: number;
    countProducts: number;
}

export function isCategoryOutputDTO(obj: unknown): obj is CategoryOutputDTO {
    return typeof obj === "object" && obj !== null &&
        "id" in obj && "name" in obj && "parentId" in obj &&
        "countSubCategories" in obj && "countProducts" in obj &&
        typeof obj.id === "string" &&
        typeof obj.countSubCategories === "number" &&
        typeof obj.countProducts === "number" &&
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
    fetchHalls: () => Promise<Hall[] | undefined>;
    fetchHall: (id: string) => Promise<Hall | undefined>;
    addHall: (hall: Omit<Hall, 'id'>) => Promise<Hall | undefined>;
    updateHall: (updatedHall: Partial<Hall>) => Promise<Hall | undefined>;
    removeHall: (id: string) => Promise<void>;
}

export type Aisle = {
    id: string;
    name: string;
    categoryIds: string[];
    stockIds: string[];
}

export interface AisleContextType {
    aisles: Aisle[];
    isLoading: boolean;
    error: string | null;
    fetchAisles: () => Promise<Aisle[] | undefined>;
    fetchAisle: (id: string) => Promise<Aisle | undefined>;
    addAisle: (aisle: Omit<Aisle, 'id'>) => Promise<Aisle | undefined>;
    updateAisle: (updatedAisle: Partial<Aisle>) => Promise<Aisle | undefined>;
    removeAisle: (id: string) => Promise<void>;
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
    value?: string | number
    onChange: (e: ChangeEvent<HTMLInputElement>) => void
    onBlur?: (e: ChangeEvent<HTMLInputElement>) => void
    type?: string
    placeholder?: string
    required?: boolean
    className?: string
    fieldClassName?: string
    error?: string
    disabled?: boolean
    step?: string;
    min?: number;
    max?: number;
    inputMode?: "text" | "decimal" | "search" | "none" | "email" | "tel" | "url" | "numeric";
    /** HTML `pattern` attribute "[0-9]*[\\.,]?[0-9]{0,2}" */
    pattern?: string;
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

export type SearchableSelectProps = {
    name: string;
    options: SelectOption[] & SelectGroup[];
    value?: string | null;
    onChange: (newValue: SelectOption | null) => void;
    emptyLabel?: string;
    defaultValue?: string | null;
    mandatory?: boolean;
    disabled?: boolean;
    error?: string | null;
    className?: string;
    classNames?: Record<string, string>;
    placeholder?: string;
    isMulti?: boolean;
    isSearchable?: boolean;
    isClearable?: boolean;
    isDisabled?: boolean;
    isInvalid?: boolean;
}

export interface StockItemDto {
    id: string;
    product: ProductOutputDTO;
    amount: number;
}

export interface StockInputDto {
    productId: string;
    amount: number;
}

export type Product = {
    id: string;
    name: string;
    category: string;
    imageUrl: string;
    variants: number;
    price: number;
};

export enum OrderItemStatus {
    DELIVERED = "Delivered",
    PENDING = "Pending",
    CANCELED = "Canceled",
}

export type OrderItem = {
    product: Product;
    status: OrderItemStatus;
    date: string;
};

export type RecentOrdersProps = {
    orders: OrderItem[];
};

export type FormValues = {
    productId: string;
    amount: number;
};

export interface StockFormProps {
    products: ProductOutputDTO[];
    onSubmit: (data: FormValues) => Promise<void | StockItemDto>;
    submitLabel: string;
    submitClassName?: string;
    iconAfter?: ReactNode;
    disabled?: boolean;
    defaultValues?: Partial<FormValues>;
}

export enum OrderStatus {
    PENDING = "PENDING",
    PROCESSING = "PROCESSING",
    SHIPPED = "SHIPPED",
    DELIVERED = "DELIVERED",
}

export interface CreateOrderItemDto {
    productId: string;
    amount: number;
}

export interface CreateOrderDto {
    wares: CreateOrderItemDto[];
    status: OrderStatus;
}

export interface OrderItemDto {
    product: ProductOutputDTO;
    amount: number;
    price: number;
}

export interface OrderDto {
    id: string;
    wares: OrderItemDto[];
    status: OrderStatus;
    createdAt: string;
    updatedAt: string;
}