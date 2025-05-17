import {CategoryOutputDTO} from "@/types";
import Card from "@/components/shared/card.tsx";
import {useCategoriesContext} from "@/context/CategoriesContext.ts";
import {cn} from "@/utils";
import CategoryLink from "@/features/category/ui/CategoryLink.tsx";
import {PropsWithChildren, useEffect, useState} from "react";

export type CategoryCardWithSubcategoriesProps = PropsWithChildren<{
    category: CategoryOutputDTO | null;
    className?: string;
    basePath?: string;
}>

export default function CategoryCardWithSubcategories({category, className, basePath, children}: CategoryCardWithSubcategoriesProps) {
    const {getCategoriesByParentId} = useCategoriesContext();

    const [subCategories, setSubCategories] = useState<CategoryOutputDTO[]>(getCategoriesByParentId(category?.id ?? null));

    useEffect(() => {
        setSubCategories(getCategoriesByParentId(category?.id ?? null));
    }, [category, getCategoriesByParentId]);

    return (
        <Card title={category?.name ? "Kategorie: " + category.name : "Kategorien"} className={cn(className, "max-w-2xl")} contentClassName="flex flex-wrap gap-2">
            {children && <div className="flex-grow basis-full">{children}</div>}
            {subCategories.map(subCategory => (
                <CategoryLink key={subCategory.id} category={subCategory} basePath={basePath} />
            ))}
            {subCategories.length === 0 && "Keine Unterkategorien"}
        </Card>
    )
}