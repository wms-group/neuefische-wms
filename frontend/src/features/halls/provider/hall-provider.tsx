import React, { useState, ReactNode, useCallback } from 'react';
import { AxiosError } from 'axios';
import { Hall } from '@/types';
import { useHallApi } from '@/features/halls';
import { HallContext } from '@/features/halls/context/hall-context';

interface HallProviderProps {
  children: ReactNode;
  initialHalls?: Hall[];
}

export const HallProvider: React.FC<HallProviderProps> = ({ children, initialHalls = [] }) => {
    const [halls, setHalls] = useState<Hall[]>(initialHalls);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { fetchHalls: apiFetchHalls, fetchHall: apiFetchHall, addHall: apiAddHall, updateHall: apiUpdateHall, removeHall: apiRemoveHall } = useHallApi();

    const fetchHalls = useCallback(async (): Promise<Hall[] | undefined> => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await apiFetchHalls();
            setHalls(data);
            return data;
        } catch (e: unknown) {
            if (e instanceof Error) {
                setError(e.message || "Failed to fetch halls");
                return undefined;
            } else {
                setError("Failed to fetch halls");
            }
        } finally {
            setIsLoading(false);
        }
    }, [apiFetchHalls]);

    const fetchHall = useCallback(async (id: string): Promise<Hall | undefined> => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await apiFetchHall(id);
            setHalls((prevHalls) => [...prevHalls.filter(h => h.id !== data.id), data]);
            return data;
        } catch (e) {
            const errorMessage = e instanceof AxiosError ? e.message : 'Failed to fetch hall';
            setError(errorMessage);
            return undefined;
        } finally {
            setIsLoading(false);
        }
    }, [apiFetchHall]);

    const addHall = useCallback(async (hall: Omit<Hall, 'id'>): Promise<Hall | undefined> => {
        setIsLoading(true);
        setError(null);
        try {
            const newHall = await apiAddHall(hall);
            setHalls((prevHalls) => [...prevHalls, newHall]);
            return newHall;
        } catch (e) {
            const errorMessage = e instanceof AxiosError ? e.message : 'Failed to add hall';
            setError(errorMessage);
            return undefined;
        } finally {
            setIsLoading(false);
        }
    }, [apiAddHall]);



    const updateHall = useCallback(async (updatedHall: Partial<Hall>): Promise<Hall | undefined> => {
        setIsLoading(true);
        setError(null);
        try {
            const updated = await apiUpdateHall(updatedHall);
            setHalls((prevHalls) =>
                prevHalls.map((hall) => (hall.id === updatedHall.id ? updated : hall))
            );
            return updated;
        } catch (err) {
            const errorMessage = err instanceof AxiosError ? err.message : 'Failed to update hall';
            setError(errorMessage);
            return undefined;
        } finally {
            setIsLoading(false);
        }
    }, [apiUpdateHall]);

    const removeHall = useCallback(async (id: string) => {
        setIsLoading(true);
        setError(null);
        try {
            await apiRemoveHall(id);
            setHalls((prevHalls) => prevHalls.filter((hall) => hall.id !== id));
        } catch (err) {
            const errorMessage = err instanceof AxiosError ? err.message : 'Failed to delete hall';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, [apiRemoveHall]);

    return (
        <HallContext.Provider value={{ halls, isLoading, error, fetchHalls, fetchHall, addHall, updateHall, removeHall }}>
            {children}
        </HallContext.Provider>
    );
};

export default HallProvider;