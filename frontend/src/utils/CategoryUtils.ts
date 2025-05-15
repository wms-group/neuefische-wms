import {CategoryOutputDTO, SelectGroup, SelectOption} from "@/types";

export function selectGroupFromCategoryOutputDTO(category: CategoryOutputDTO): SelectGroup {
    return {
        label: category.name,
        options: [{
            value: category.id,
            label: category.name,
        }]
    }
}

export function selectOptionsFromCategorieOutputDTOs(categories: CategoryOutputDTO[], parentId: string | null = null, prefix: string = ""): SelectOption[] {
    let options: SelectOption[] =  [];
    categories.filter(category => category.parentId === parentId).forEach(category => {
        options.push({
            value: category.id,
            label: prefix + " " + category.name,
        })
        options = [...options, ...selectOptionsFromCategorieOutputDTOs(categories, category.id, prefix + "-")];
    })
    return options
}

export function selectGroupsFromCategoryOutputDTOs(categories: CategoryOutputDTO[]): SelectGroup[] {
    return categories
        .filter(c => c.parentId === null)
        .map(category => {
            const group = selectGroupFromCategoryOutputDTO(category);
            group.options = [...group.options, ...selectOptionsFromCategorieOutputDTOs(categories, category.id, "-")];
            return group;
    });
}