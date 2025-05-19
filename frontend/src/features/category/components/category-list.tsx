import {CategoryOutputDTO, GridLayoutProps} from "@/types";
import {CategoryCard} from "@/features/category";
import GridLayout from "@/components/shared/grid-layout.tsx";

export type CategoryListProps = {
    categories: CategoryOutputDTO[]
    className?: string;
    parentId?: string | null;
    gridCols?: GridLayoutProps["gridCols"];
};

export default function CategoryList({categories, parentId, gridCols, className}: CategoryListProps = {
    categories: []
}) {
    return (
        <GridLayout className={className} gridCols={gridCols}>
            {categories.length > 0
                ? categories
                    .filter(category => parentId === undefined || category.parentId === parentId)
                    .map(category => (
                            <CategoryCard
                                key={category.id}
                                category={category}
                                countSubCategories={
                                    categories
                                        .filter(subCategory => subCategory.parentId === category.id).length
                                }
                            />
                        )
                    )
                : <h3 className="text-center">Keine Kategorien</h3>}
        </GridLayout>
    )
}