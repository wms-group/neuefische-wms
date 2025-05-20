import api from '@/api/axios';
import { Aisle } from '@/types';
import { useMemo } from 'react';

const uri = "/aisles";

export const useAisleApi = () => {
    const fetchAisles = async (): Promise<Aisle[]> => {
        const response = await api.get<Aisle[]>(uri);
        return response.data;
    };
    
    const fetchAisle = async (id: string): Promise<Aisle> => {
        const response = await api.get<Aisle>(`${uri}/${id}`);
        return response.data;
    };
    
    const addAisle = async (hall: Omit<Aisle, 'id'>): Promise<Aisle> => {
        const response = await api.post<Aisle>(uri, hall);
        return response.data;
    };
    
    const updateAisle = async (updatedAisle: Partial<Aisle>): Promise<Aisle> => {
        const response = await api.put<Aisle>(uri, updatedAisle);
        return response.data;
    };

    const removeAisle = async (id: string): Promise<void> => {
        await api.delete(`${uri}/${id}`);
    };

    return useMemo(() => ({ 
        fetchAisles,
        fetchAisle, 
        addAisle, 
        updateAisle, 
        removeAisle 
    }), []);
};