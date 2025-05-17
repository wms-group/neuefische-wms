import api from '@/api/axios';
import { Hall } from '@/types';

export const useHallApi = () => {
    const fetchHalls = async (): Promise<Hall[]> => {
        const response = await api.get<Hall[]>('/halls');
        return response.data;
    };
    
    const addHall = async (hall: Omit<Hall, 'id'>): Promise<Hall> => {
        const response = await api.post<Hall>('/halls', hall);
        return response.data;
    };
    
    const updateHall = async (updatedHall: Partial<Hall>): Promise<Hall> => {
        const response = await api.put<Hall>(`/halls`, updatedHall);
        return response.data;
    };

    const removeHall = async (id: string): Promise<void> => {
        await api.delete(`/halls/${id}`);
    };

  return { fetchHalls, addHall, updateHall, removeHall };
};