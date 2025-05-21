import {CategoryInputDTO, CategoryOutputDTO} from "@/types";
import {CategoryBreadcrumbs, CategoryList, CategoryNewFormCard} from "@/features/category";
import {toast} from "sonner";
import {AxiosError} from "axios";
import {useCategoriesContext} from "@/context/CategoriesContext.ts";
import LayoutContainer from "@/components/shared/layout-container.tsx";
import {Link, useParams} from "react-router-dom";
import {ChevronLeft} from "lucide-react";
import {useEffect, useState} from "react";
import {useProductContext} from "@/context/products/useProductContext.ts";
import GridLayout from "@/components/shared/grid-layout.tsx";

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
        <LayoutContainer className={"category-list-page flex flex-col flex-1 gap-4 z-1"}>
            <h2 className={"flex flew-row"}>{category ? (<><Link to={"/categories/" + (category.parentId ?? "")}><ChevronLeft/></Link>{category?.name}</>) : (<>Neue Kategorie</>)}</h2>
            {category && <CategoryBreadcrumbs category={category} />}
            <CategoryNewFormCard onSubmit={handleSubmitNewCategory} defaultParentId={categoryId ?? ""}/>
            <h3>Kategorien</h3>
            <GridLayout gridCols={{ base: 1, lg: 2, xl: 2 }}>
            <CategoryList parentId={category?.id ?? null} onSubmit={handleSubmitUpdatedCategory} onDelete={handleDeleteCategory}/>
            </GridLayout>
        </LayoutContainer>
    )
}

export default CategoryListPage;