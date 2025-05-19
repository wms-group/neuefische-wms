import {CategoryCard} from "@/features/category";
import {useCategoriesContext} from "@/context/CategoriesContext";

export type CategoryListProps = {
    className?: string;
    parentId?: string | null;
};

export default function CategoryList({parentId}: CategoryListProps) {
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
                                countSubCategories={
                                    getCategoriesByParentId(category.id).length
                                }
                            />
                        )
                    )
                : <h3 className="text-center">Keine Kategorien</h3>}
        </>
    )
}