import {CategoryOutputDTO, ProductOutputDTO, SelectGroup, SelectOption} from "@/types";
import {selectNestedGroupsFromCategoryOutputDTOs} from "@/utils/CategoryUtils.ts";

export function selectProductsInCategoriesFromCategoryOutputDTOs(categories: CategoryOutputDTO[], products: ProductOutputDTO[]): SelectGroup[] & SelectOption[] {
    return selectNestedGroupsFromCategoryOutputDTOs(categories)
        .map(group => ({
                ...group,
                options: products.filter(product => product.categoryId === group.options[0].value)
                    .map(product => ({
                        label: product.name,
                        value: product.id
                    }))
            })
        ) as SelectGroup[] & SelectOption[];
}