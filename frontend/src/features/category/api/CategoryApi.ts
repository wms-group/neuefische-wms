import axios from "axios";
import {
    CategoryInputDTO,
    CategoryOutputDTO,
    isCategoryOutputDTO,
    isErrorDTO
} from "@/types";

export const CategoryApi = {
    baseUrl: '/api/categories',

    cancelableGetAllRef: null as AbortController | null,
    cancelableSavePositionsRef: null as AbortController | null,
    cancelableSaveCategoryRef: null as AbortController | null,
    cancelableUpdateCategoryRef: {} as Record<string, AbortController | null>,
    cancelableDeleteCategoryRef: {} as Record<string, AbortController | null>,

    throwErrorByResponse(error: unknown) {
        console.error(error);
        if (axios.isAxiosError(error) && isErrorDTO(error.response?.data)) {
            throw new Error(error.response.data.message ?? "Unbekannter Fehler");
        }
        throw new Error("Unbekannter Fehler");
    },

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
            this.throwErrorByResponse(error);
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
            this.throwErrorByResponse(error);
        }
        throw new TypeError("Ungültige Antwort beim Speichern der Kategorie");
    },
    
    async updateCategory(submittedCategory: CategoryInputDTO, categoryId: string): Promise<CategoryOutputDTO | null> {
        this.cancelableUpdateCategoryRef[categoryId]?.abort();
        this.cancelableUpdateCategoryRef[categoryId] = new AbortController();

        try {
            const response = await axios.put(this.baseUrl + "/" + categoryId, submittedCategory, {
                signal: this.cancelableUpdateCategoryRef[categoryId].signal
            });
            if (isCategoryOutputDTO(response.data)) {
                return response.data
            }
        } catch (error) {
            if (axios.isCancel(error)) {
                return null;
            }
            this.throwErrorByResponse(error);
        }
        throw new TypeError("Ungültige Antwort beim Speichern der Kategorie");
    },

    async deleteCategory(categoryId: string, moveToCategory?: string): Promise<void> {
        this.cancelableDeleteCategoryRef[categoryId]?.abort();
        this.cancelableDeleteCategoryRef[categoryId] = new AbortController();

        try {
            if (moveToCategory === undefined) {
                await axios.delete(this.baseUrl + "/" + categoryId, {
                    signal: this.cancelableDeleteCategoryRef[categoryId].signal
                })
            } else {
                await axios.delete(this.baseUrl + "/delete-and-move/" + categoryId + "?moveToCategory=" + moveToCategory, {
                    signal: this.cancelableDeleteCategoryRef[categoryId].signal
                });
            }
        } catch (error) {
            if (axios.isCancel(error)) {
                return;
            }
            this.throwErrorByResponse(error);
        }
    },
}

export default CategoryApi;