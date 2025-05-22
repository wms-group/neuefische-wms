import {ChangeEvent, FormEvent, ReactNode, useRef, useState} from 'react';
import Card from '@/components/shared/card';
import {Aisle, CategoryOutputDTO} from '@/types';
import {arraysEqual, cn, selectGroupsFromCategoryOutputDTOs} from '@/utils';
import SearchableSelect from '@/components/ui/SearchableSelect';
import {CategoryPill} from '@/features/category';
import Button from '@/components/ui/button';
import {InputWithLabel} from "@/components/ui";

type CreationProps = {
    aisle: Aisle,
    categories: CategoryOutputDTO[],
    onSubmit: (aisle: Aisle) => Promise<Aisle>,
    creates: true,
    actions?: ReactNode
}

type UpdateProps = {
    aisle: Aisle,
    categories: CategoryOutputDTO[],
    onSubmit: (aisle: Aisle) => Promise<Aisle>,
    creates?: boolean,
    actions?: ReactNode
}

type Props = CreationProps | UpdateProps;

const EditableAisleCard = ({aisle, categories, onSubmit, creates, actions}: Props) => {
    const [editingAisle, setEditingAisle] = useState(aisle);
    const aisleCategories = editingAisle.categoryIds.map(cid => categories.find(c => c.id === cid)).filter(Boolean) as typeof categories;

    const formRef = useRef<HTMLFormElement>(null);

    const isUnchanged = aisle.name === editingAisle.name && arraysEqual(aisle.categoryIds, editingAisle.categoryIds);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setEditingAisle({...editingAisle, [name]: value});
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await onSubmit(editingAisle);

        if (creates) {
            setEditingAisle({
                id: "",
                name: "",
                categoryIds: [],
                stockIds: []
            });
        }
    }

    const handleSelect = (e: ChangeEvent<HTMLInputElement>) => {
        const {value} = e.target;

        if (aisleCategories.some(ac => ac.id === value)) {
            return;
        }

        setEditingAisle({
            ...editingAisle,
            categoryIds: [value, ...editingAisle.categoryIds]
        });
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
        <Card className={"max-w-4xl"} title={creates ? "Neuer Gang" : ""}
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
                          onClick={() => formRef.current?.requestSubmit()}
                          disabled={editingAisle.name === "" || isUnchanged}>
                          {creates ? "Hinzufügen" : "Speichern"}
                      </Button>
                  </div>
              }>
            <div className='flex flex-col gap-1'>
                <form
                    ref={(ref) => {
                        formRef.current = ref
                    }}
                    onSubmit={handleSubmit}
                    className={"flex flex-col gap-1 lg:flex-row justify-between lg:items-end"}
                >
                    <div className="h-full w-full lg:w-1/2">
                        <InputWithLabel
                            type={'text'}
                            label={'Gang Name'}
                            name={'name'}
                            value={editingAisle.name}
                            onChange={handleChange}
                            onBlur={handleChange}
                            className="bg-white"
                        />
                    </div>

                    <div className="h-full grow flex-basis-60">
                        <label className={cn("text-sm/6 font-medium text-gray")}>Kategorie hinzufügen:
                            <SearchableSelect
                                name="categoryId"
                                options={selectGroupsFromCategoryOutputDTOs(categories)}
                                onChange={(newValue) => handleSelect({
                                    target: {
                                        name: 'parentId',
                                        value: newValue?.value
                                    }
                                } as unknown as React.ChangeEvent<HTMLInputElement>)}
                                value={""}
                            />
                        </label>
                    </div>
                </form>
                <div className='flex flex-wrap gap-1 my-2'>
                    {/* TODO: fix that the card should not expand */}
                    {
                        aisleCategories.map(c => (
                            <CategoryPill
                                key={c.id}
                                category={c}
                                onRemove={handleCategoryRemoval}
                            />
                        ))
                    }

                </div>
            </div>
        </Card>
    )
}

export default EditableAisleCard