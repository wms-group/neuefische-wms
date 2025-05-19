import {CategoryInputDTO} from "@/types";
import {CategoryForm, CategoryList} from "@/features/category";
import {toast} from "sonner";
import {AxiosError} from "axios";
import {useCategoriesContext} from "@/context/CategoriesContext.ts";
import LayoutContainer from "@/components/shared/layout-container.tsx";

const CategoryListPage = () => {
    const {categories, addCategory} = useCategoriesContext();

    const handleSubmitCategory = async (category: CategoryInputDTO) => {
        return toast.promise(addCategory(category),
            {
                loading: "Speichere Kategorie...",
                success: "Kategorie erfolgreich gespeichert.",
                error: (reason: AxiosError) => "Speichern der Kategorie fehlgeschlagen: " + reason.message
            });
    }

    return (
        <LayoutContainer className={"category-list-page flex flex-col flex-1 gap-4 z-1"}>
            <h2>Neue Kategorie</h2>
            <CategoryForm onSubmit={handleSubmitCategory} categories={categories} />
            <h2>Kategorien</h2>
            <CategoryList categories={categories} parentId={null} gridCols={{ base: 1, sm: 2, xl: 3 }} />
        </LayoutContainer>
    )
}

export default CategoryListPage;