import {CategoryCard} from "@/features/category";
import {cn} from "@/utils";
import { useCategoriesContext } from "@/context/CategoriesContext";

export type CategoryListProps = {
    className?: string;
    parentId?: string | null;
};

export default function CategoryList({parentId, className}: CategoryListProps) {
    const {getCategoriesByParentId} = useCategoriesContext();
    const categories = getCategoriesByParentId(parentId ?? null);

    return (
        categories && <div className={cn("category-list flex flex-col gap-2", className)}>
            { categories
                .map(category => (
                        <div key={category.id} className="category-list-item">
                            <CategoryCard
                                category={category}
                                countSubCategories={getCategoriesByParentId(category.id).length}
                            />
                        </div>
                )
                )}
        </div>
    )
}