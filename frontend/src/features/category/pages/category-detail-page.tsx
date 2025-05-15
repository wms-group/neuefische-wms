import {CategoryBreadcrumbs, CategoryForm, CategoryList} from "@/features/category";
import {Link, useParams} from "react-router-dom";
import {useCategoriesContext} from "@/context/CategoriesContext.ts";
import {useEffect, useState} from "react";
import {CategoryInputDTO, CategoryOutputDTO} from "@/types";
import {toast} from "sonner";
import {AxiosError} from "axios";
import {ChevronLeft} from "lucide-react";

const CategoryDetailPage = () => {
    const categoryId = useParams().id;

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
        category && <div className={"category-details-page p-2 flex flex-col gap-4"}>
            <h2 className={"flex flew-row"}><Link to={category.parentId ? "/categories/" + category.parentId : "/categories"}><ChevronLeft/></Link>{category.name}</h2>
            <CategoryBreadcrumbs category={category} />
            <CategoryForm onSubmit={handleSubmitCategory} categories={categories} defaultParentId={category.id} />
            <CategoryList categories={categories} parentId={category.id} />
        </div>
    )
}

export default CategoryDetailPage;