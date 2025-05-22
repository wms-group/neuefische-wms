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
        loading: true,
        error: null
    });

    let loadCounter = 0;

    function increaseCounterAndSetLoading() {
        loadCounter++;
        setLoading(loadCounter > 0);
    }

    function decreaseCounterAndSetLoading() {
        loadCounter--;
        setLoading(loadCounter > 0);
    }

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

    const withAddedCategorySorted = (categories: CategoryOutputDTO[], category: CategoryOutputDTO) => {
        return [category, ...categories.filter(d => d.id !== category.id)]
            .sort((a, b) => a.name.localeCompare(b.name));
    }

    function withReplacedCategorySorted(existingCategories: CategoryOutputDTO[], category: CategoryOutputDTO) {
        return existingCategories.map(p => p.id === category.id ? category : p)
            .sort((a, b) => a.name.localeCompare(b.name));
    }

    function withRemovedCategory(existingCategories: CategoryOutputDTO[], categoryId: string) {
        return existingCategories.filter(p => p.id !== categoryId);
    }

    const addCategory = (newCategory: CategoryInputDTO) => {
        increaseCounterAndSetLoading();
        setError(null);
        return CategoriesApi.saveCategory(newCategory)
            .then((savedCategory) => {
                if (savedCategory && isCategoryOutputDTO(savedCategory)) {
                    setCategories(prev => withAddedCategorySorted(prev, savedCategory));
                    return savedCategory;
                }
                setError("Ungültige Antwort beim Speichern der Kategorie")
                throw new TypeError("Ungültige Antwort beim Speichern der Kategorie");
            })
            .catch(e => {
                setError(e.message);
                throw e;
            })
            .finally(() => decreaseCounterAndSetLoading());
    }

    const updateCategory = (changedCategory: CategoryInputDTO, categoryId: string) => {
        increaseCounterAndSetLoading();
        setError(null);
        return CategoriesApi.updateCategory(changedCategory, categoryId)
            .then((updatedCategory) => {
                if (updatedCategory && isCategoryOutputDTO(updatedCategory)) {
                    setCategories(prev => withReplacedCategorySorted(prev, updatedCategory));
                    return updatedCategory;
                }
                setError("Ungültige Antwort beim Speichern der Kategorie")
                throw new TypeError("Ungültige Antwort beim Speichern der Kategorie");
            })
            .catch(e => {
                setError(e.message);
                throw e;
            })
            .finally(() => decreaseCounterAndSetLoading());
    }

    const deleteCategory = (categoryId: string, moveToCategory?: string) => {
        increaseCounterAndSetLoading();
        setError(null);
        return CategoriesApi.deleteCategory(categoryId, moveToCategory)
            .then(() => {
                setCategories(prev => withRemovedCategory(prev, categoryId));
            })
            .catch(e => {
                setError(e.message);
                throw e;
            })
            .finally(() => decreaseCounterAndSetLoading());
    }

    const flushCategories = () => {
        increaseCounterAndSetLoading();
        CategoriesApi.getAllCategories()
            .then(categories => {
                setCategories(categories);
            })
            .catch((e: { message: string | null; }) => setError(e.message))
            .finally(() => {
                decreaseCounterAndSetLoading()
            });
    }

    useEffect(() => {
        flushCategories()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return {
        categories: state.categories,
        getCategoriesByParentId,
        loading: state.loading,
        error: state.error,
        addCategory,
        deleteCategory,
        updateCategory,
        flushCategories
    };
}