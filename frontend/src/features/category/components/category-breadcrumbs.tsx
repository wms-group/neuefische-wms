import {CategoryOutputDTO} from "@/types";
import {useCategoriesContext} from "../../../../context/CategoriesContext.ts";
import { Link } from "react-router-dom";
import {cn} from "@/utils";

type CategoryBreadcrumbsProps = {
    category: CategoryOutputDTO
    className?: string;
    append?: React.ReactNode;
}

export default function CategoryBreadcrumbs({category, append, className}: CategoryBreadcrumbsProps) {
    const {categories} = useCategoriesContext();
    const parentCategory = categories.find(c => c.id === category.parentId);

    return (
        category.parentId === null ? (
            <div className={cn("flex items-center breadcrumbs text-sm", className)}>
                <span><Link to={"/categories"}>Kategorien</Link></span>
                <span>&nbsp;&gt;&nbsp;</span>
                <span><Link to={"/categories/" + category.id}>{category.name}</Link></span>
                {append && <><span>&nbsp;&gt;&nbsp;</span>{append}</>}
            </div>
        ) : (
            parentCategory &&
            <CategoryBreadcrumbs
                className={className}
                category={parentCategory}
                append={<>
                    <span><Link to={"/categories/" + category.id}>{category.name}</Link></span>
                    {append && <>(<span>&nbsp;&gt;&nbsp;</span>{append})</>}
                </>}
            />
        )
    )
}