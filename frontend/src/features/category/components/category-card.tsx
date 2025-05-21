import {CategoryInputDTO, CategoryOutputDTO, SelectOption} from "@/types";
import Card from "@/components/shared/card.tsx";
import {cn, selectGroupsFromCategoryOutputDTOs} from "@/utils";
import Button from "@/components/ui/button.tsx";
import {Dispatch, useEffect, useState} from "react";
import CategoryLink from "@/features/category/ui/CategoryLink.tsx";
import {CategoryForm} from "@/features/category";
import ButtonWithSelect from "@/components/ui/ButtonWithSelect.tsx";
import {useCategoriesContext} from "@/context/CategoriesContext.ts";

type CategoryCardProps = {
    category: CategoryOutputDTO;
    countSubCategories: number;
    className?: string;
    onDelete?: (categoryId: string, moveToCategory?: string) => Promise<unknown>;
    onSubmit?: (submittedCategory: CategoryInputDTO, categoryId: string) => Promise<unknown>;
}

type CategoryActionsProps = {
    category: CategoryOutputDTO;
    onDelete?: (categoryId: string, moveToCategory?: string) => Promise<unknown>;
    onSubmit?: (submittedCategory: CategoryInputDTO, categoryId: string) => Promise<unknown>;
    isEditing: boolean;
    handleEdit: () => void;
    handleDelete: () => void;
    handleMoveTo: (value: SelectOption | null) => void;
    handleSubmitClicked: () => void;
    value: string | null;
    categories: CategoryOutputDTO[];
}

const CategoryActions = ({category, onDelete, onSubmit, isEditing, handleEdit, handleDelete, handleMoveTo, handleSubmitClicked, value, categories}: CategoryActionsProps)=> (
    <>
        <>{onSubmit && <EditOrSubmitButton
            isEditing={isEditing}
            handleEdit={handleEdit}
            handleSubmitClicked={handleSubmitClicked}/>}</>
        <>{isEditing && <Button onClick={handleEdit}>Abbrechen</Button>}</>
        <>{onDelete && <ButtonWithSelect
            label="Elemente verschieben nach"
            name="select"
            onClick={handleDelete}
            onChange={handleMoveTo}
            defaultValue={category.parentId ?? ""}
            value={value}
            emptyLabel="Unterelemente löschen"
            options={selectGroupsFromCategoryOutputDTOs(categories.filter(c => c.id !== category.id))}
            className={cn("bg-red-300 text-white/90 p-2")}>
            Löschen
        </ButtonWithSelect>}
        </>
    </>
)

type EditOrSubmitButtonProps = {
    isEditing: boolean;
    handleEdit: () => void;
    handleSubmitClicked: () => void;
}

const EditOrSubmitButton = ({isEditing, handleEdit, handleSubmitClicked}: EditOrSubmitButtonProps) => (
    isEditing ?
        (<Button onClick={handleSubmitClicked}>Speichern</Button>) :
        (<Button onClick={handleEdit}>Bearbeiten</Button>)
)

type CategoryEditProps = {
    category: CategoryOutputDTO;
    onSubmit: (category: CategoryInputDTO) => Promise<unknown>;
    setFormRef?: Dispatch<React.SetStateAction<HTMLFormElement | null>>;
}

const CategoryEdit = ({category, onSubmit, setFormRef}: CategoryEditProps) => (
    <CategoryForm defaultParentId={category.parentId ?? ""} onSubmit={onSubmit} value={category} {...{setFormRef}}></CategoryForm>
)

type CategoryContentProps = {
    category: CategoryOutputDTO;
    countSubCategories: number;
    countProducts: number;
}

const CategoryContent = ({category, countSubCategories, countProducts}: CategoryContentProps) => (
    <><CategoryLink category={category}>
        {countSubCategories ? (countSubCategories + " Unterkategorien") : ("keine Unterkategorien")}
    </CategoryLink>
        <CategoryLink category={category} basePath={"/products/category"}>
            {countProducts ? (countProducts + " Produkte") : ("keine Produkte")}
        </CategoryLink></>
)

const CategoryCard = ({category, onDelete, onSubmit, className}: CategoryCardProps) => {
    const {categories} = useCategoriesContext();

    useEffect(() => {
        setMoveTo(category.parentId ?? null);
    }, [category]);

    const [isEditing, setIsEditing] = useState(false);
    const [moveTo, setMoveTo] = useState<string | null>(null);

    const [formRef, setFormRef] = useState<HTMLFormElement | null>(null);

    const handleDelete = () => {
        if (!onDelete) return Promise.resolve();
        setIsEditing(false);
        if (!moveTo || moveTo === "") return onDelete(category.id);
        return onDelete(category.id, moveTo);
    }

    const handleEdit = () => {
        setIsEditing(!isEditing);
    }

    const handleMoveTo = (option: SelectOption | null) => {
        setMoveTo(option?.value ?? null);
    }

    const handleSubmitClicked = () => {
        if (!formRef) return;
        formRef.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));
    }

    const handleSubmit = async (submittedCategory: CategoryInputDTO): Promise<unknown> => {
        if (!onSubmit) return Promise.resolve();
        return onSubmit(submittedCategory, category.id)
            .then(() => {
                setIsEditing(false);
            })
    }

    return (
        <Card title={category.name} actions={
            <div className={"flex flex-col text-sm items-start gap-2 justify-between w-full sm:text-base md:flex-row sm:items-center"}>
                <CategoryActions
                    category={category}
                    onDelete={onDelete}
                    onSubmit={onSubmit}
                    isEditing={isEditing}
                    handleEdit={handleEdit}
                    handleDelete={handleDelete}
                    handleMoveTo={handleMoveTo}
                    handleSubmitClicked={handleSubmitClicked}
                    value={moveTo}
                    categories={categories}
                />
            </div>
        } className={cn("lg:max-w-2xl", className)}>
            {isEditing ?
                <CategoryEdit
                    category={category}
                    onSubmit={handleSubmit}
                    setFormRef={setFormRef}
                /> :
                <CategoryContent
                    category={category}
                    countSubCategories={category.countSubCategories}
                    countProducts={category.countProducts}
                />}
        </Card>
    )
}

export default CategoryCard;