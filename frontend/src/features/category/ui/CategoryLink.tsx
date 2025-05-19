import {PropsWithChildren} from "react";
import {Link} from "react-router-dom";
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
        <Link to={to ?? path} className={cn("text-indigo-900 underline", showBrackets && "before:content-['['] after:content-[']']", className)}>{children ?? category?.name}</Link>
    )
}

export default CategoryLink;