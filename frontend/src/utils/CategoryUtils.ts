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
            label: prefix + "\u00A0\u2570" + category.name,
        })
        options = [...options, ...selectOptionsFromCategorieOutputDTOs(categories, category.id, prefix + "\u00A0\u00A0\u00A0\u00A0")];
    })
    return options
}

export function selectGroupsFromCategoryOutputDTOs(categories: CategoryOutputDTO[]): SelectGroup[] & SelectOption[] {
    return categories
        .filter(c => c.parentId === null)
        .map(category => {
            const group = selectGroupFromCategoryOutputDTO(category);
            group.options = [...group.options, ...selectOptionsFromCategorieOutputDTOs(categories, category.id, "\u00A0")];
            return group;
    }) as SelectGroup[] & SelectOption[];
}

export function selectNestedGroupsFromCategoryOutputDTOs(categories: CategoryOutputDTO[], parentId: string | null = null): SelectGroup[] {
    return categories
        .filter(c => c.parentId === parentId)
        .flatMap(category => {
            const group = {
                label: category.name,
                options: [{
                    value: category.id,
                    label: '###placeholder###'
                }],
            } as SelectGroup;
            return [group, ...selectNestedGroupsFromCategoryOutputDTOs(categories, category.id)];
        });
}