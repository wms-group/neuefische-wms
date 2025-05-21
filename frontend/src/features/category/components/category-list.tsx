import {CategoryCard} from "@/features/category";
import {useCategoriesContext} from "@/context/CategoriesContext";
import {CategoryInputDTO} from "@/types";

export type CategoryListProps = {
    onSubmit?: (submittedCategory: CategoryInputDTO, categoryId: string) => Promise<unknown>;
    onDelete?: (categoryId: string, moveToCategory?: string) => Promise<unknown>;
    className?: string;
    parentId?: string | null;
};

export default function CategoryList({parentId, onSubmit, onDelete}: CategoryListProps) {
    const {getCategoriesByParentId} = useCategoriesContext();
    const categories = getCategoriesByParentId(parentId ?? null);
    return (
        <>
            {categories.length > 0
                ? categories
                    .map(category => (
                            <CategoryCard
                                key={category.id}
                                category={category}
                                countSubCategories={category.countSubCategories}
                                onSubmit={onSubmit}
                                onDelete={onDelete}
                                className="lg:min-w-full"
                            />
                        )
                    )
                : <h3 className="text-center">Keine Kategorien</h3>}
        </>
    )
}