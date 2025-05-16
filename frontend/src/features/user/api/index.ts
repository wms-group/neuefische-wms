import api from "@/api/axios.ts";
import {UserDto} from "@/types";
import {toast} from "sonner";
import axios from "axios";

export const createUser = async (userData: Omit<UserDto, "id">) => {
    try {
        const response = await api.post<UserDto>("/wms-group", userData);
        toast.success(`${userData.username} created successfully!`);
        return response.data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            const message = error.response?.data?.error || error.message;
            toast.error(message);
        } else if (error instanceof Error) {
            toast.error(error.message);
        } else {
            toast.error(`Failed to create ${userData.username}: Unknown error`);
        }
        throw error;
    }
};

export const getUsers = async () => {
    try {
        const response = await api.get<UserDto[]>("/wms-group");
        return response.data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            const message = error.response?.data?.error || error.message;
            toast.error(`Failed to load users: ${message}`);
        } else if (error instanceof Error) {
            toast.error(`Failed to load users: ${error.message}`);
        } else {
            toast.error(`Failed to load users: Unknown error`);
        }
        throw error;
    }
};

export const updateUser = async (user: UserDto) => {
    if (!user.id) throw new Error("User ID is required for update");

    try {
        const response = await api.put<UserDto>(`/wms-group/${user.id}`, user);
        toast.success(`${user.username} updated successfully!`);
        return response.data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            const message = error.response?.data?.error || error.message;
            toast.error(`${user.username} update failed: ${message}`);
        } else if (error instanceof Error) {
            toast.error(`${user.username} update failed: ${error.message}`);
        } else {
            toast.error(`${user.username} update failed: Unknown error`);
        }
        throw error;
    }
};

export const deleteUser = async (id: string) => {
    try {
        await api.delete(`/wms-group/${id}`);
        toast.success(`User deleted successfully!`);
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            const message = error.response?.data?.error || error.message;
            toast.error(`Failed to delete user: ${message}`);
        } else if (error instanceof Error) {
            toast.error(`Failed to delete user: ${error.message}`);
        } else {
            toast.error(`Failed to delete user: Unknown error`);
        }
        throw error;
    }
};
