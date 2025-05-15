import {CategoryOutputDTO} from "@/types";
import {CategoryCard, CategoryList} from "@/features/category";

export type CategoryCardWithSubcategoriesProps = {
    category: CategoryOutputDTO;
    subCategories: CategoryOutputDTO[];
}

export default function CategoryCardWithSubcategories({category, subCategories}: CategoryCardWithSubcategoriesProps) {
    return (
        <div className={"category-card-container border"}>
            <CategoryCard category={category} countSubCategories={subCategories.length}/>
            <div className={"category-card-subcategories"}>
                <CategoryList categories={subCategories}/>
            </div>
        </div>
    )
}