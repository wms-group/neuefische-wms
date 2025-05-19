import {CategoryInputDTO, CategoryOutputDTO, SelectOption} from "@/types";
import Card from "@/components/shared/card.tsx";
import {cn, selectGroupsFromCategoryOutputDTOs} from "@/utils";
import Button from "@/components/ui/button.tsx";
import {useEffect, useRef, useState} from "react";
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
            className={cn("bg-red-300 text-white/90")}>
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
    formRef?: React.RefObject<HTMLFormElement>;
}

const CategoryEdit = ({category, onSubmit, formRef}: CategoryEditProps) => (
    <CategoryForm defaultParentId={category.parentId ?? ""} onSubmit={onSubmit} value={category} {...{formRef}}></CategoryForm>
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

    const formRef = useRef<HTMLFormElement>(null);

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
        if (!formRef.current) return;
        formRef.current.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));
    }

    const handleSubmit = (submittedCategory: CategoryInputDTO): Promise<unknown> => {
        if (!onSubmit) return Promise.resolve();
        return onSubmit(submittedCategory, category.id)
            .then(() => {
                setIsEditing(false);
            })
    }

    return (
        <Card title={category.name} actions={<CategoryActions
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
        />} className={cn(className, "max-w-2xl")}>
            {isEditing ?
                <CategoryEdit
                    category={category}
                    onSubmit={handleSubmit}
                    {...(formRef.current !== null && {formRef: formRef as React.RefObject<HTMLFormElement>})}
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