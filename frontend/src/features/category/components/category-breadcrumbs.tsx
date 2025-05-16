import {CategoryOutputDTO} from "@/types";
import {useCategoriesContext} from "@/context/CategoriesContext.ts";
import {cn} from "@/utils";
import CategoryLink from "@/features/category/ui/CategoryLink.tsx";

type CategoryBreadcrumbsProps = {
    category: CategoryOutputDTO
    rootName?: string;
    rootPath?: string;
    className?: string;
    append?: React.ReactNode;
    basePath?: string;
}

export default function CategoryBreadcrumbs({category, rootName, rootPath, append, basePath, className}: CategoryBreadcrumbsProps) {
    const {categories} = useCategoriesContext();
    const parentCategory = categories.find(c => c.id === category.parentId);

    return (
        category.parentId === null ? (
            <div className={cn("flex items-center breadcrumbs text-sm", className)}>
                <span><CategoryLink
                    basePath={rootPath || basePath}
                    withBrackets={false}
                >
                    {rootName || "Kategorien"}
                </CategoryLink></span>
                <span>&nbsp;&gt;&nbsp;</span>
                <span><CategoryLink
                    category={category}
                    basePath={basePath}
                    withBrackets={false}
                /></span>
                {append && <><span>&nbsp;&gt;&nbsp;</span>{append}</>}
            </div>
        ) : (
            parentCategory &&
            <CategoryBreadcrumbs
                className={className}
                category={parentCategory}
                rootName={rootName}
                rootPath={rootPath}
                basePath={basePath}
                append={<>
                    <span><CategoryLink
                        category={category}
                        basePath={basePath}
                        withBrackets={false}
                    /></span>
                    {append && <><span>&nbsp;&gt;&nbsp;</span>{append}</>}
                </>}
            />
        )
    )
}