import api from '@/api/axios';
import { Hall } from '@/types';
import { useMemo } from 'react';

const uri = "/halls";

export const useHallApi = () => {

    const fetchHalls = async (): Promise<Hall[]> => {
        const response = await api.get<Hall[]>(uri);
        return response.data;
    };

    const fetchHall = async(id: string): Promise<Hall> => {
        const response = await api.get<Hall>(`${uri}/${id}`);
        return response.data;
    };
    
    const addHall = async (hall: Omit<Hall, 'id'>): Promise<Hall> => {
        const response = await api.post<Hall>(uri, hall);
        return response.data;
    };
    
    const updateHall = async (updatedHall: Partial<Hall>): Promise<Hall> => {
        const response = await api.put<Hall>(uri, updatedHall);
        return response.data;
    };

    const removeHall = async (id: string): Promise<void> => {
        await api.delete(`${uri}/${id}`);
    };

    return useMemo(() => ({ 
        fetchHalls,
        fetchHall,
        addHall,
        updateHall,
        removeHall 
    }), []);
};