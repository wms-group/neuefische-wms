import {CategoryBreadcrumbs, CategoryForm, CategoryList} from "@/features/category";
import {Link, useParams} from "react-router-dom";
import {useCategoriesContext} from "@/context/CategoriesContext.ts";
import {useEffect, useState} from "react";
import {CategoryInputDTO, CategoryOutputDTO} from "@/types";
import {toast, Toaster} from "sonner";
import {AxiosError} from "axios";
import {ChevronLeft} from "lucide-react";
import LayoutContainer from "@/components/shared/layout-container.tsx";

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
        category && <LayoutContainer className={"category-details-page flex flex-col gap-4 z-1"}>
            <h2 className={"flex flew-row"}><Link to={category.parentId ? "/categories/" + category.parentId : "/categories"}><ChevronLeft/></Link>{category.name}</h2>
            <CategoryBreadcrumbs category={category} />
            <CategoryForm onSubmit={handleSubmitCategory} categories={categories} defaultParentId={category.id} />
            <CategoryList
                categories={categories}
                parentId={category.id}
                gridCols={{ base: 1, sm: 2, md: 3 }}
            />
            <Toaster />
        </LayoutContainer>
    )
}

export default CategoryDetailPage;