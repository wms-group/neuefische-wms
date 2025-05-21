import {Dispatch, useEffect, useState} from "react";
import {CategoryInputDTO, CategoryOutputDTO} from "@/types";
import {cn, selectGroupsFromCategoryOutputDTOs} from "@/utils";
import {InputWithLabel, SearchableSelect} from "@/components/ui";
import {useCategoriesContext} from "@/context/CategoriesContext.ts";

type CategoryFormProps = {
    onSubmit: (category: CategoryInputDTO) => Promise<unknown>;
    value?: CategoryOutputDTO;
    disabled?: boolean;
    defaultParentId: string | null;
    className?: string;
    setFormRef?: Dispatch<React.SetStateAction<HTMLFormElement | null>>;
}

const CategoryForm = ({onSubmit, value, disabled, defaultParentId, className, setFormRef}: CategoryFormProps) => {
    const [category, setCategory] = useState<CategoryInputDTO>({
        name: value?.name ?? "",
        parentId: value?.parentId ?? defaultParentId,
    });

    const categories = useCategoriesContext().categories;

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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setCategory({...category, [name]: value});
    }

    return (
        <form
            ref={setFormRef}
            className={cn("flex flex-col md:flex-row gap-6 justify-between items-center", className, disabled && "opacity-50 cursor-not-allowed")}
            onSubmit={handleSubmit}>
            <div className="h-full w-full">
                <InputWithLabel
                    label={"Name"}
                    value={category.name}
                    onChange={handleChange}
                    onBlur={handleChange}
                    name={"name"}
                    disabled={disabled}
                    className="bg-white/95"
                />
            </div>
            {value && <div className="h-full w-full">
                <label htmlFor="parentId" className={cn("text-sm/6 font-medium text-gray")}>verschieben nach...</label>
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
            </div>}
        </form>
    )
}

export default CategoryForm;