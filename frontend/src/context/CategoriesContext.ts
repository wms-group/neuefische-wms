import {createContext, useContext} from "react";
import {useCategoriesApi} from "@/hooks/useCategories.ts";

type CategoriesContextType = useCategoriesApi;

const CategoriesContext = createContext<CategoriesContextType | undefined>(undefined);

export default CategoriesContext;

export function useCategoriesContext() {
    const ctx = useContext(CategoriesContext);
    if (!ctx) throw new Error("useCategoriesContext muss innerhalb von CategoriesProvider verwendet werden!");
    return ctx;
}

export function useAddCategoryContext() {
    const ctx = useContext(CategoriesContext);
    if (!ctx) throw new Error("useAddCategoryContext muss innerhalb von CategoriesProvider verwendet werden!");
    return ctx.addCategory;
}

