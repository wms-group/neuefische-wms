import {ButtonType, CategoryInputDTO, CategoryOutputDTO} from "@/types";
import {useRef, useState} from "react";
import {cn, selectGroupsFromCategoryOutputDTOs} from "@/utils";
import {clsx} from "clsx";
import Card from "@/components/shared/card.tsx";
import SearchableSelect from "@/components/ui/SearchableSelect.tsx";
import {Button} from "@/components/ui";

type CategoryFormProps = {
    onSubmit: (category: CategoryInputDTO) => Promise<unknown>;
    categories: CategoryOutputDTO[];
    defaultParentId?: string | null;
    className?: string;
}

export default function CategoryForm({categories, onSubmit, className, defaultParentId}: CategoryFormProps) {
    const [category, setCategory] = useState<CategoryInputDTO>({
        name: "",
        parentId: defaultParentId,
    });

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
            className={className}
            actions={
                <Button
                    type={ButtonType.submit}
                    disabled={!category.name}
                    onClick={() =>
                        formRef.current?.dispatchEvent(new Event("submit", {cancelable: true, bubbles: true}))
                    }
                    className="rounded self-end flex-grow-0 bg-gray-600 px-4 py-2 text-sm text-white hover:bg-gray-500 hover:data-active:bg-gray-700">
                    hinzufügen
                </Button>
            }
        >
            <form
                ref={(ref) => {
                    formRef.current = ref
                }}
                className={cn("flex flex-col md:flex-row gap-6 justify-between items-center", className)}
                onSubmit={handleSubmit}>
                <div className="h-full w-full">
                    <label htmlFor="name" className={cn("text-sm/6 font-medium text-gray")}>Name</label>
                    <input
                        name="name"
                        value={category.name}
                        placeholder={"Category Name..."}
                        className={cn(
                            'block w-full rounded border-none bg-white/95 px-3 py-1.5 text-gray-900',
                            'focus:not-data-focus:outline-none data-focus:outline-2 data-focus:-outline-offset-2 data-focus:outline-gray-900'
                        )}
                        onChange={handleChange}
                    />
                </div>
                <div className="h-full w-full">
                    <label htmlFor="parentId" className={clsx("text-sm/6 font-medium text-gray")}>Unterkategorie
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
        </Card>
    )

}