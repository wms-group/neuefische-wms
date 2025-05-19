import {cn, selectGroupsFromCategoryOutputDTOs} from "@/utils";
import {clsx} from "clsx";
import SearchableSelect from "@/components/ui/SearchableSelect.tsx";
import {CategoryInputDTO, CategoryOutputDTO} from "@/types";
import {useEffect, useState} from "react";
import {useCategoriesContext} from "@/context/CategoriesContext.ts";

type CategoryFormProps = {
    onSubmit: (category: CategoryInputDTO) => Promise<unknown>;
    value?: CategoryOutputDTO;
    defaultParentId: string;
    className?: string;
    formRef?: React.RefObject<HTMLFormElement | null>;
}

const CategoryForm = ({onSubmit, value, defaultParentId, className, formRef}: CategoryFormProps) => {
    const [category, setCategory] = useState<CategoryInputDTO>({
        name: value?.name ?? "",
        parentId: value?.parentId ?? defaultParentId,
    });

    useEffect(() => {
        setCategory(prev => { return {...prev, parentId: defaultParentId}});
    }, [defaultParentId]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const savedCategory = await onSubmit(category);
        if (!value) {
            setCategory({
                name: "",
                parentId: defaultParentId,
            });
        }
        return savedCategory;
    }

    const categories = useCategoriesContext().categories;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setCategory({...category, [name]: value});
    }

    return (
        <form
            ref={(ref) => {
                if (formRef) {
                    formRef.current = ref
                }
            }}
            className={cn("flex gap-1 flex-row justify-between items-end", className)}
            onSubmit={handleSubmit}>
            <div className="h-full grow flex-basis-40">
                <label htmlFor="name" className={cn("text-sm/6 font-medium text-gray")}>Name</label>
                <input
                    name="name"
                    value={category.name}
                    className={cn(
                        'block w-full rounded border-none bg-white/95 px-3 py-1.5 text-gray-900',
                        'focus:not-data-focus:outline-none data-focus:outline-2 data-focus:-outline-offset-2 data-focus:outline-gray-900'
                    )}
                    onChange={handleChange}
                />
            </div>
            <div className="h-full grow flex-basis-60">
                <label htmlFor="parentId" className={clsx("text-sm/6 font-medium text-gray")}>Kategorie</label>
                <SearchableSelect
                    name="parentId"
                    options={selectGroupsFromCategoryOutputDTOs(categories)}
                    onChange={(newValue) => handleChange({target: {name: 'parentId', value: newValue?.value}} as unknown as React.ChangeEvent<HTMLInputElement>)}
                    value={category.parentId}
                    defaultValue={defaultParentId}/>
            </div>
        </form>
    )
}

export default CategoryForm;