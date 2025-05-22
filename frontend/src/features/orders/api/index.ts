import api from "@/api/axios";
import {CreateOrderDto, OrderDto} from "@/types";
import {toast} from "sonner";

const baseUrl = "/orders";

export const createOrder = async (orderData: CreateOrderDto): Promise<OrderDto> => {
    const response = await api.post<OrderDto>(baseUrl, orderData);
    toast.success("Order created successfully!");
    return response.data;
};

export const getOrders = async (): Promise<OrderDto[]> => {
    const response = await api.get<OrderDto[]>(baseUrl);
    return response.data;
};

export const updateOrder = async (id: string, orderData: CreateOrderDto): Promise<OrderDto> => {
    const response = await api.put<OrderDto>(`${baseUrl}/${id}`, orderData);
    toast.success("Order updated successfully!");
    return response.data;
};

export const deleteOrder = async (id: string): Promise<void> => {
    await api.delete(`${baseUrl}/${id}`);
    toast.success("Order deleted successfully!");
};
