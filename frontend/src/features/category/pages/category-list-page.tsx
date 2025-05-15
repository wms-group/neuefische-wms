import {CategoryInputDTO} from "@/types";
import {CategoryForm, CategoryList} from "@/features/category";
import {toast, Toaster} from "sonner";
import {AxiosError} from "axios";
import {useCategoriesContext} from "../../../../context/CategoriesContext.ts";

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
        <div className={"category-list-page p-2 flex flex-col gap-4"}>
            <h2>Kategorien</h2>
            <CategoryForm onSubmit={handleSubmitCategory} categories={categories} />
            <CategoryList categories={categories} parentId={null} />
            <Toaster />
        </div>
    )
}

export default CategoryListPage;