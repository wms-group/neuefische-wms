import {CategoryInputDTO, CategoryOutputDTO} from "@/types";
import {useState} from "react";
import {cn, selectGroupsFromCategoryOutputDTOs} from "@/utils";
import {Plus} from "lucide-react";
import Select from "react-select";

type CategoryFormProps = {
    onSubmit: (category: CategoryInputDTO) => Promise<unknown>;
    categories: CategoryOutputDTO[];
    defaultParentId?: string | null;
    className?: string;
}

export default function CategoryForm({ categories, onSubmit, className, defaultParentId }: CategoryFormProps) {
    const [category, setCategory] = useState<CategoryInputDTO>({
        name: "",
        parentId: null,
    });

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await onSubmit(category);
        setCategory({
            name: "",
            parentId: null,
        });
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setCategory({...category, [name]: value});
    }

    return (
        <form className={cn(className, "flex flex-row gap-2 justify-items-start flex-nowrap max-w-3xl")} onSubmit={handleSubmit}>
            <input className="basis-60 grow border border-gray-600" type="text" placeholder="Neue Kategorie..." name="name" value={category.name} onChange={handleChange} />
            <Select
                name="parentId"
                classNamePrefix={'select'}
                className="basis-40 grow"
                value={{
                    'label':
                        categories.find(c => c.id === (category.parentId ?? defaultParentId))?.name || 'keine',
                    'value': category.parentId ?? defaultParentId}}
                options={selectGroupsFromCategoryOutputDTOs(categories)}
                onChange={(newValue) => handleChange({target: {name: 'parentId', value: newValue?.value}} as unknown as React.ChangeEvent<HTMLInputElement>)}
            />
            <button type="submit" className="basis-6 shrink"><Plus /></button>
        </form>
    )

}