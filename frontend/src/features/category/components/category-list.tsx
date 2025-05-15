import {CategoryOutputDTO} from "@/types";
import {CategoryCard} from "@/features/category";
import {cn} from "@/utils";

export type CategoryListProps = {
    categories: CategoryOutputDTO[]
    className?: string;
    parentId?: string | null;
};

export default function CategoryList({categories, parentId, className}: CategoryListProps = {
    categories: []
}) {
    return (
        <div className={cn("category-list flex flex-col gap-2", className)}>
            { categories
                .filter(category => parentId === undefined || category.parentId === parentId)
                .map(category => (
                        <div key={category.id} className="category-list-item">
                            <CategoryCard
                                category={category}
                                countSubCategories={categories.filter(subCategory => subCategory.parentId === category.id).length}
                            />
                        </div>
                )
                )}
        </div>
    )
}