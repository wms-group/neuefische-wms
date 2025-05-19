import {CategoryInputDTO} from "@/types";
import {useEffect, useRef, useState} from "react";
import {cn, selectGroupsFromCategoryOutputDTOs} from "@/utils";
import {clsx} from "clsx";
import Card from "@/components/shared/card.tsx";
import SearchableSelect from "@/components/ui/SearchableSelect.tsx";
import { useCategoriesContext } from "@/context/CategoriesContext";
import Button from "@/components/ui/button.tsx";

type CategoryFormProps = {
    onSubmit: (category: CategoryInputDTO) => Promise<unknown>;
    defaultParentId?: string | null;
    className?: string;
}

export default function CategoryForm({ onSubmit, className, defaultParentId }: CategoryFormProps) {
    const [category, setCategory] = useState<CategoryInputDTO>({
        name: "",
        parentId: defaultParentId ?? null,
    });

    const {categories} = useCategoriesContext();

    useEffect(() => {
        setCategory(prev => { return {...prev, parentId: defaultParentId ?? null}});
    }, [defaultParentId]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await onSubmit(category);
        setCategory({
            name: "",
            parentId: defaultParentId ?? null,
        });
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setCategory({...category, [name]: value});
    }

    const formRef = useRef<HTMLFormElement>(null);

    return (
        <Card
            title={"Neue Kategorie"}
            className={cn(className, "max-w-2xl")}
            actions={<Button onClick={() => formRef.current?.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }))}>
                hinzufügen
            </Button>}
        >
            <form
                ref={(ref) => {
                    formRef.current = ref
                }}
                className={cn("flex gap-1 flex-row justify-between items-end", className)}
                onSubmit={handleSubmit}>
                    <div className="h-full grow flex-basis-60">
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
                        <label htmlFor="parentId" className={clsx("text-sm/6 font-medium text-gray")}>Unterkategorie von...</label>
                        <SearchableSelect
                            name="parentId"
                            options={selectGroupsFromCategoryOutputDTOs(categories)}
                            onChange={(newValue) => handleChange({target: {name: 'parentId', value: newValue?.value}} as unknown as React.ChangeEvent<HTMLInputElement>)}
                            value={category.parentId}
                            defaultValue={defaultParentId}/>
                    </div>
            </form>
        </Card>
    )

}