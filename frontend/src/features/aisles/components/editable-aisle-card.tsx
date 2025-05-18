import { ReactNode, useRef, useState } from 'react';
import Card from '@/components/shared/card';
import { Aisle, CategoryOutputDTO } from '@/types';
import { arraysEqual, cn, selectGroupsFromCategoryOutputDTOs } from '@/utils';
import SearchableSelect from '@/components/ui/SearchableSelect';
import { CategoryPill } from '@/features/category';
import Button from '@/components/ui/button';

type CreationProps = {
    aisle: Aisle,
    categories: CategoryOutputDTO[],
    onSubmit: (aisle: Aisle) => Promise<Aisle | unknown>,
    creates: true,
    actions?: ReactNode
}

type UpdateProps = {
    aisle: Aisle,
    categories: CategoryOutputDTO[],
    onSubmit: (aisle: Aisle) => Promise<Aisle | unknown>,
    creates?: boolean,
    actions?: ReactNode
}

type Props = CreationProps | UpdateProps;

const EditableAisleCard = ({ aisle, categories, onSubmit, creates, actions }: Props) => {
    const [editingAisle, setEditingAisle] = useState(aisle);
    const aisleCategories = editingAisle.categoryIds.map(cid => categories.find(c => c.id === cid)).filter(Boolean) as typeof categories;
    
    const formRef = useRef<HTMLFormElement>(null);

    const isUnchanged = aisle.name === editingAisle.name && arraysEqual(aisle.categoryIds, editingAisle.categoryIds);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        console.log("Button disabled: ", aisle.name === editingAisle.name && arraysEqual(aisle.categoryIds, editingAisle.categoryIds));
        setEditingAisle({...editingAisle, [name]: value});
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await onSubmit(editingAisle);

        if(creates) {
            setEditingAisle({
                id: "",
                name: "",
                categoryIds: [],
                stockIds: []
            });
        }
    }

    const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {value} = e.target;

        if(aisleCategories.some(ac => ac.id === value)) {
            return;
        }

        setEditingAisle({
            ...editingAisle,
            categoryIds: [value, ...editingAisle.categoryIds]
        });
        console.log(aisle.categoryIds);
    }

    const handleCategoryRemoval = (categoryId: string) => {
        setEditingAisle({
            ...editingAisle,
            categoryIds: editingAisle.categoryIds.filter(cid => cid !== categoryId)
        });
    }

    const handleReset = () => {
        setEditingAisle(aisle);
    }

    return (
        <Card title={creates ? "Neuer Gang" : ""} 
            actions={
                <div className='flex gap-2'>
                        {
                            !creates && !isUnchanged && <Button 
                                onClick={handleReset}>
                                Reset
                            </Button>
                        }
                        {actions}
                    
                    <Button 
                        onClick={() => formRef.current?.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }))}
                        disabled={editingAisle.name === "" || isUnchanged}>
                        {creates ? "Hinzufügen" : "Speichern"}
                    </Button>
                </div>
            }>
                <div className='flex flex-col gap-1'>
                    <form 
                        ref={(ref) => {formRef.current = ref}}
                        onSubmit={handleSubmit}
                        className={"flex gap-1 flex-row justify-between items-end"}
                        >
                            <div className="h-full grow flex-basis-60">
                                <label htmlFor="name" className={cn("text-sm/6 font-medium text-gray")}>Name</label>
                                <input
                                    name="name"
                                    className={cn(
                                        'block w-full rounded border-none bg-white/95 px-3 py-1.5 text-gray-900',
                                        'focus:not-data-focus:outline-none data-focus:outline-2 data-focus:-outline-offset-2 data-focus:outline-gray-900'
                                    )}
                                    onChange={handleChange}
                                    value={editingAisle.name}
                                />
                            </div>

                            <div className="h-full grow flex-basis-60">
                                <label className={cn("text-sm/6 font-medium text-gray")}>Kategorie hinzufügen:</label>
                                <SearchableSelect
                                            name="categoryId"
                                            options={selectGroupsFromCategoryOutputDTOs(categories)}
                                            onChange={(newValue) => handleSelect({target: {name: 'parentId', value: newValue?.value}} as unknown as React.ChangeEvent<HTMLInputElement>)}
                                            value={""}
                                            />
                            </div>
                    </form>
                    <div className='flex flex-wrap gap-0.5'> 
                        {/* TODO: fix that the card should not expand */}
                        {
                            aisleCategories.map(c => (
                                <CategoryPill
                                    key={c.id}
                                    category={c}
                                    actions={
                                        <button
                                            type="button"
                                            className="ml-2 text-xs text-gray-400 hover:text-red-500"
                                            aria-label="Kategorie entfernen"
                                            onClick={() => handleCategoryRemoval(c.id)}
                                        >
                                            ×
                                        </button>
                                    }
                                />
                            ))
                        }

                    </div>
                </div>
        </Card>
    )
}

export default EditableAisleCard