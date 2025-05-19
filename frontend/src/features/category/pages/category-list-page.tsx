import {CategoryInputDTO, CategoryOutputDTO} from "@/types";
import {CategoryBreadcrumbs, CategoryForm, CategoryList} from "@/features/category";
import {toast} from "sonner";
import {AxiosError} from "axios";
import {useCategoriesContext} from "@/context/CategoriesContext.ts";
import LayoutContainer from "@/components/shared/layout-container.tsx";
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
        <LayoutContainer className={"category-list-page flex flex-col flex-1 gap-4 z-1"}>
            <h2 className={"flex flew-row"}>{category ? (<><Link to={"/categories/" + (category.parentId ?? "")}><ChevronLeft/></Link>{category?.name}</>) : (<>Neue Kategorie</>)}</h2>
            {category && <CategoryBreadcrumbs category={category} />}
            <CategoryForm onSubmit={handleSubmitCategory} defaultParentId={categoryId ?? null}/>
            <h2>Kategorien</h2>
            <CategoryList
                parentId={category?.id ?? null}
                gridCols={{ base: 1, sm: 2, xl: 3 }}
            />
        </LayoutContainer>
    )
}

export default CategoryListPage;