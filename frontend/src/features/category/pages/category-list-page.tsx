import {CategoryInputDTO, CategoryOutputDTO} from "@/types";
import {CategoryBreadcrumbs, CategoryForm, CategoryList} from "@/features/category";
import {toast, Toaster} from "sonner";
import {AxiosError} from "axios";
import {useCategoriesContext} from "@/context/CategoriesContext.ts";
import {Link, useParams} from "react-router-dom";
import {ChevronLeft} from "lucide-react";
import {useEffect, useState} from "react";

const CategoryListPage = () => {
    const categoryId = useParams().categoryId;

    const [category, setCategory] = useState<CategoryOutputDTO | undefined>(undefined);

    const {categories, addCategory} = useCategoriesContext();

    const handleSubmitCategory = async (category: CategoryInputDTO) => {
        return toast.promise(addCategory(category),
            {
                loading: "Speichere Kategorie...",
                success: "Kategorie erfolgreich gespeichert.",
                error: (reason: AxiosError) => "Speichern der Kategorie fehlgeschlagen: " + reason.message
            });
    }

    useEffect(() => {
        setCategory(categories.find(c => c.id === categoryId))
    }, [categoryId, categories])

    return (
        <div className={"category-list-page p-2 flex flex-col gap-4"}>
            <h2 className={"flex flew-row"}>{category ? (<><Link to={"/categories/" + (category.parentId ?? "")}><ChevronLeft/></Link>{category?.name}</>) : (<>Kategorien</>)}</h2>
            {category && <CategoryBreadcrumbs category={category} />}
            <CategoryForm onSubmit={handleSubmitCategory} defaultParentId={categoryId ?? null}/>
            <CategoryList parentId={category?.id || null} />
            <Toaster />
        </div>
    )
}

export default CategoryListPage;