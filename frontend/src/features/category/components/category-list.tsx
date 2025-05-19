import {CategoryCard} from "@/features/category";
import {cn} from "@/utils";
import { useCategoriesContext } from "@/context/CategoriesContext";
import {CategoryInputDTO} from "@/types";

export type CategoryListProps = {
    onSubmit?: (submittedCategory: CategoryInputDTO, categoryId: string) => Promise<unknown>;
    onDelete?: (categoryId: string, moveToCategory?: string) => Promise<unknown>;
    className?: string;
    parentId?: string | null;
};

export default function CategoryList({parentId, className, onSubmit, onDelete}: CategoryListProps) {
    const {getCategoriesByParentId} = useCategoriesContext();
    const categories = getCategoriesByParentId(parentId ?? null);

    return (
        categories && <div className={cn("category-list flex flex-col gap-2", className)}>
            { categories
                .map(category => (
                        <div key={category.id} className="category-list-item">
                            <CategoryCard
                                category={category}
                                countSubCategories={category.countSubCategories}
                                onSubmit={onSubmit}
                                onDelete={onDelete}
                            />
                        </div>
                )
                )}
        </div>
    )
}