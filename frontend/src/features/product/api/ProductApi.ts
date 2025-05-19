import axios from "axios";
import {ProductInputDTO, ProductOutputDTO, isProductOutputDTO, isErrorDTO} from "@/types";

export const ProductApi = {
    baseUrl: '/api/products',

    cancelableGetAllRef: null as AbortController | null,
    cancelableSavePositionsRef: null as AbortController | null,
    cancelableSaveProductRef: null as AbortController | null,
    cancelableUpdateProductRef: {} as Record<string, AbortController | null>,
    cancelableDeleteProductRef: {} as Record<string, AbortController | null>,

    throwErrorByResponse(error: unknown) {
        console.error(error);
        if (axios.isAxiosError(error) && isErrorDTO(error.response?.data)) {
            throw new Error(error.response.data.message ?? "Unbekannter Fehler");
        }
        throw new Error("Unbekannter Fehler");
    },

    async getProductsByCategoryId(categoryId: string): Promise<ProductOutputDTO[]> {
        this.cancelableGetAllRef?.abort();
        this.cancelableGetAllRef = new AbortController();

        try {
            const response = await axios.get(this.baseUrl + "/category/" + categoryId, {
                signal: this.cancelableGetAllRef.signal
            });
            if (Array.isArray(response.data) && response.data.every(isProductOutputDTO)) {
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

    async saveProduct(submittedProduct: ProductInputDTO): Promise<ProductOutputDTO | null> {
        this.cancelableSaveProductRef?.abort();
        this.cancelableSaveProductRef = new AbortController();

        try {
            const response = await axios.post(this.baseUrl, submittedProduct, {
                signal: this.cancelableSaveProductRef.signal
            });
            if (isProductOutputDTO(response.data)) {
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
}

export default ProductApi;