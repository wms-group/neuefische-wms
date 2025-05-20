import {Dispatch, useEffect, useState} from "react";
import {CategoryInputDTO, CategoryOutputDTO} from "@/types";
import {cn, selectGroupsFromCategoryOutputDTOs} from "@/utils";
import SearchableSelect from "@/components/ui/SearchableSelect.tsx";
import {useCategoriesContext} from "@/context/CategoriesContext.ts";
import {InputWithLabel} from "@/components/ui";

type CategoryFormProps = {
    onSubmit: (category: CategoryInputDTO) => Promise<unknown>;
    value?: CategoryOutputDTO;
    defaultParentId: string;
    className?: string;
    setFormRef?: Dispatch<React.SetStateAction<HTMLFormElement | null>>;
}

const CategoryForm = ({onSubmit, value, defaultParentId, className, setFormRef}: CategoryFormProps) => {
    const [category, setCategory] = useState<CategoryInputDTO>({
        name: value?.name ?? "",
        parentId: value?.parentId ?? defaultParentId,
    });

    useEffect(() => {
        setCategory(prev => {
            return {...prev, parentId: defaultParentId}
        });
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
            ref={setFormRef}
            className={cn("flex flex-col md:flex-row gap-6 justify-between items-center", className)}
            onSubmit={handleSubmit}>
            <div className="h-full w-full">
                <InputWithLabel
                    label={"Name"}
                    value={category.name}
                    onChange={handleChange}
                    onBlur={handleChange}
                    name={"name"}
                    placeholder={"Category Name..."}
                    className={cn(
                        'block w-full rounded border-none bg-white/95 px-3 py-1.5 text-gray-900',
                        'focus:not-data-focus:outline-none data-focus:outline-2 data-focus:-outline-offset-2 data-focus:outline-gray-900'
                    )}
                />
            </div>
            <div className="h-full w-full">
                <label htmlFor="parentId" className={cn("text-sm/6 font-medium text-gray")}>Unterkategorie
                    von...</label>
                <SearchableSelect
                    name="parentId"
                    options={selectGroupsFromCategoryOutputDTOs(categories)}
                    onChange={(newValue) => handleChange({
                        target: {
                            name: 'parentId',
                            value: newValue?.value
                        }
                    } as unknown as React.ChangeEvent<HTMLInputElement>)}
                    value={category.parentId}
                    defaultValue={defaultParentId}
                />
            </div>
        </form>
    )
}

export default CategoryForm;