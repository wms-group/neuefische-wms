import axios from "axios";
import api from "@/api/axios.ts";
import {StockInputDto, StockItemDto} from "@/types";
import {toast} from "sonner";

const STOCK_BASE_URL = "/stock";

export const getStockAmountByProductId = async (
    productId: string
): Promise<StockItemDto> => {
    try {
        const response = await api.get<StockItemDto>(`${STOCK_BASE_URL}/count/${productId}`);
        return response.data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            const message = error.response?.data?.error || error.message;
            toast.error(`Failed to load stock amount: ${message}`);
        } else if (error instanceof Error) {
            toast.error(`Failed to load stock amount: ${error.message}`);
        } else {
            toast.error(`Failed to load stock amount: Unknown error`);
        }
        throw error;
    }
};

export const createStockItem = async (input: StockInputDto): Promise<StockItemDto> => {
    try {
        const response = await api.post<StockItemDto>(`${STOCK_BASE_URL}`, input);
        toast.success("Stock item created successfully!");
        return response.data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            const message = error.response?.data?.error || error.message;
            toast.error(`Failed to create stock: ${message}`);
        } else if (error instanceof Error) {
            toast.error(`Failed to create stock: ${error.message}`);
        } else {
            toast.error(`Failed to create stock: Unknown error`);
        }
        throw error;
    }
};


export const deleteStockItem = async (input: StockInputDto): Promise<void> => {
    try {
        await api.delete(`${STOCK_BASE_URL}`, { data: input });
        toast.success("Stock item deleted successfully!");
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            const message = error.response?.data?.error || error.message;
            toast.error(`Failed to delete stock: ${message}`);
        } else if (error instanceof Error) {
            toast.error(`Failed to delete stock: ${error.message}`);
        } else {
            toast.error(`Failed to delete stock: Unknown error`);
        }
        throw error;
    }
};

export const getStocks = async () => {
    try {
        const response = await api.get<StockItemDto[]>(`${STOCK_BASE_URL}`);
        return response.data;
    } catch (e: unknown) {
        if(axios.isAxiosError(e)) {
            const message = e.response?.data?.error || e.message;
            toast.error(`Failed to load stocks: ${message}`);
        } else if (e instanceof Error) {
            toast.error(`Failed to load stocks: ${e.message}`);
        } else {
            toast.error(`Failed to load stocks: Unknown error`);
        }
        throw e;
    }
}