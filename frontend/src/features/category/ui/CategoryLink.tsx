import {PropsWithChildren} from "react";
import {NavLink} from "react-router-dom";
import {CategoryOutputDTO} from "@/types";
import {cn} from "@/utils";

type CategoryLinkProps = PropsWithChildren<{
    category?: CategoryOutputDTO;
    className?: string;
    basePath?: string;
    to?: string;
    withBrackets?: boolean;
}>

const CategoryLink = ({category, to, children, basePath, className, withBrackets}: CategoryLinkProps) => {
    const path = (basePath ?? "/categories") + "/" + (category?.id ?? "");
    const showBrackets = withBrackets === undefined ? true : withBrackets;

    return (
        <NavLink to={to ?? path}
                 end
                 className={({isActive}) => cn(
                     "text-indigo-900 font-medium",
                     isActive && "font-semibold border-b-2 border-b-indigo-900 pb-0.25",
                     showBrackets && "before:content-['['] after:content-[']']",
                     className
                 )}>{children ?? category?.name}</NavLink>
    )
}

export default CategoryLink;