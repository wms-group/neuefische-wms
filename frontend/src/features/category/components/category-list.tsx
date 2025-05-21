import {CategoryCard, CategoryListSkeleton} from "@/features/category";
import {useCategoriesContext} from "@/context/CategoriesContext";
import {CategoryInputDTO} from "@/types";

export type CategoryListProps = {
    onSubmit?: (submittedCategory: CategoryInputDTO, categoryId: string) => Promise<unknown>;
    onDelete?: (categoryId: string, moveToCategory?: string) => Promise<unknown>;
    basePath?: string;
    parentId?: string | null;
};



export default function CategoryList({parentId, onSubmit, onDelete, basePath}: Readonly<CategoryListProps>) {
    const {getCategoriesByParentId, loading} = useCategoriesContext();
    const categories = getCategoriesByParentId(parentId ?? null);

    if (loading) {
        return (
            <CategoryListSkeleton count={4}/>
        )
    }

    return (
        <>
            {categories.length > 0
                ? categories
                    .map(category => (
                            <CategoryCard
                                key={category.id}
                                category={category}
                                countSubCategories={category.countSubCategories}
                                basePath={basePath}
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