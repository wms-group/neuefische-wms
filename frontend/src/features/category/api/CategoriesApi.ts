import axios from "axios";
import {CategoryInputDTO, CategoryOutputDTO, isCategoryOutputDTO} from "@/types";

export const CategoriesApi = {
    baseUrl: '/api/categories',

    cancelableGetAllRef: null as AbortController | null,
    cancelableSavePositionsRef: null as AbortController | null,
    cancelableSaveCategoryRef: null as AbortController | null,
    cancelableUpdateCategoryRef: {} as Record<string, AbortController | null>,
    cancelableDeleteCategoryRef: {} as Record<string, AbortController | null>,

    async getAllCategories(): Promise<CategoryOutputDTO[]> {
        this.cancelableGetAllRef?.abort();
        this.cancelableGetAllRef = new AbortController();

        try {
            const response = await axios.get(this.baseUrl, {
                signal: this.cancelableGetAllRef.signal
            });
            if (Array.isArray(response.data) && response.data.every(isCategoryOutputDTO)) {
                return response.data;
            }
        } catch (error) {
            if (axios.isCancel(error)) {
                return [];
            }
        }
        throw new TypeError("Ungültige Antwort beim Laden der Kategorien");
    },

    async saveCategory(submittedCategory: CategoryInputDTO): Promise<CategoryOutputDTO | null> {
        this.cancelableSaveCategoryRef?.abort();
        this.cancelableSaveCategoryRef = new AbortController();

        try {
            const response = await axios.post(this.baseUrl, submittedCategory, {
                signal: this.cancelableSaveCategoryRef.signal
            });
            if (isCategoryOutputDTO(response.data)) {
                return response.data
            }
        } catch (error) {
            if (axios.isCancel(error)) {
                return null;
            }
        }
        throw new TypeError("Ungültige Antwort beim Speichern der Kategorie");
    },
}

export default CategoriesApi;