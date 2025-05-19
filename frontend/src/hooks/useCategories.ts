import {useEffect, useState} from "react";
import {CategoryInputDTO, CategoryOutputDTO, isCategoryOutputDTO} from "@/types";
import {CategoriesApi} from "@/features/category/api";

export type useCategoriesApi = ReturnType<typeof useCategories>;

type StateProps = {
    categories: CategoryOutputDTO[];
    loading: boolean;
    error: string | null;
}

export default function useCategories() {
    const [state, setState] = useState<StateProps>({
        categories: [],
        loading: false,
        error: null
    });

    function setCategories(categoriesOrSetter: CategoryOutputDTO[] | ((prev: CategoryOutputDTO[]) => CategoryOutputDTO[])) {
        if (Array.isArray(categoriesOrSetter)) {
            setState(prev => ({ ...prev, categories: categoriesOrSetter }));
            return
        }
        setState(prev => ({ ...prev, categories: categoriesOrSetter(prev.categories) }));
    }

    function getCategoriesByParentId(parentId: string | null): CategoryOutputDTO[] {
        return state.categories.filter(c => c.parentId === parentId);
    }

    function setError(error: string | null) {
        setState(prev => ({ ...prev, error }));
    }

    function setLoading(loading: boolean) {
        setState(prev => ({ ...prev, loading }));
    }

    useEffect(() => {
        setLoading(true);
        CategoriesApi.getAllCategories()
            .then(setCategories)
            .catch((e: { message: string | null; }) => setError(e.message))
            .finally(() => setLoading(false));
    }, []);

    const withAddedCategoryAtFirst = (categories: CategoryOutputDTO[], category: CategoryOutputDTO) => {
        return [category, ...categories.filter(d => d.id !== category.id)];
    }

    const addCategory = (newCategory: CategoryInputDTO) => {
        setLoading(true);
        setError(null);
        return CategoriesApi.saveCategory(newCategory)
            .then((savedCategory) => {
                if (savedCategory && isCategoryOutputDTO(savedCategory)) {
                    setCategories(prev => withAddedCategoryAtFirst(prev, savedCategory));
                    return savedCategory;
                }
                setError("Ungültige Antwort beim Speichern des Gerichts")
                throw new TypeError("Ungültige Antwort beim Speichern des Gerichts");
            })
            .catch(e => {
                setError(e.message);
                throw e;
            })
            .finally(() => setLoading(false));
    }

    return {
        categories: state.categories,
        getCategoriesByParentId,
        loading: state.loading,
        error: state.error,
        addCategory,
    };
}