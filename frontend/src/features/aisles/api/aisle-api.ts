import axios from 'axios';
import { Aisle } from '../types/aisle';

const api = axios.create({
  baseURL: '/api',
});

export const useAisleApi = () => {
    const fetchHalls = async (): Promise<Aisle[]> => {
        const response = await api.get<Aisle[]>('/aisles');
        return response.data;
    };
    
    const addHall = async (hall: Omit<Aisle, 'id'>): Promise<Aisle> => {
        const response = await api.post<Aisle>('/aisles', hall);
        return response.data;
    };
    
    const updateHall = async (updatedHall: Partial<Aisle>): Promise<Aisle> => {
        const response = await api.put<Aisle>(`/aisles`, updatedHall);
        return response.data;
    };

    const removeHall = async (id: string): Promise<void> => {
        await api.delete(`/aisles/${id}`);
    };

  return { fetchHalls, addHall, updateHall, removeHall };
};