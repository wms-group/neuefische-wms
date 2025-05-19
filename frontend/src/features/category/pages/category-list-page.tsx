import {CategoryInputDTO, CategoryOutputDTO} from "@/types";
import {CategoryBreadcrumbs, CategoryNewFormCard, CategoryList} from "@/features/category";
import {toast, Toaster} from "sonner";
import {AxiosError} from "axios";
import {useCategoriesContext} from "@/context/CategoriesContext.ts";
import {Link, useParams} from "react-router-dom";
import {ChevronLeft} from "lucide-react";
import {useEffect, useState} from "react";
import {useProductContext} from "@/context/products/useProductContext.ts";

const CategoryListPage = () => {
    const categoryId = useParams().categoryId;

    const [category, setCategory] = useState<CategoryOutputDTO | undefined>(undefined);

    const {categories, addCategory, updateCategory, deleteCategory, flushCategories} = useCategoriesContext();
    const {flushProducts} = useProductContext();

    const handleSubmitNewCategory = async (category: CategoryInputDTO) => {
        return toast.promise(addCategory(category),
            {
                loading: "Speichere Kategorie...",
                success: "Kategorie erfolgreich gespeichert.",
                error: (reason: AxiosError) => "Speichern der Kategorie fehlgeschlagen: " + reason.message
            });
    }

    const handleSubmitUpdatedCategory = async (category: CategoryInputDTO, categoryId: string) => {
        return toast.promise(updateCategory(category, categoryId),
            {
                loading: "Speichere Kategorie...",
                success: "Kategorie erfolgreich gespeichert.",
                error: (reason: AxiosError) => "Speichern der Kategorie fehlgeschlagen: " + reason.message
            });
    }

    const handleDeleteCategory = async (categoryId: string, moveToCategory?: string) => {
        return toast.promise(deleteCategory(categoryId, moveToCategory)
                .then(() => {
                    flushCategories();
                    flushProducts();
                }),
            {
                loading: "Lösche Kategorie...",
                success: "Kategorie erfolgreich gelöscht.",
                error: (reason: AxiosError) => "Löschen der Kategorie fehlgeschlagen: " + reason.message
            });
    }
    useEffect(() => {
        setCategory(categories.find(c => c.id === categoryId))
    }, [categoryId, categories])

    return (
        <div className={"category-list-page p-2 flex flex-col gap-4"}>
            <h2 className={"flex flew-row"}>{category ? (<><Link to={"/categories/" + (category.parentId ?? "")}><ChevronLeft/></Link>{category?.name}</>) : (<>Kategorien</>)}</h2>
            {category && <CategoryBreadcrumbs category={category} />}
            <CategoryNewFormCard onSubmit={handleSubmitNewCategory} defaultParentId={categoryId ?? ""}/>
            <CategoryList parentId={category?.id ?? null} onSubmit={handleSubmitUpdatedCategory} onDelete={handleDeleteCategory}/>
            <Toaster />
        </div>
    )
}

export default CategoryListPage;