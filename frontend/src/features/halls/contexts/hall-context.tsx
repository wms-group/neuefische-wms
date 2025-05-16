import React, { createContext, useState, ReactNode } from 'react';
import { Hall, HallContextType } from '../types/hall';
import { useHallApi } from '../api/hall-api';
import { AxiosError } from 'axios';

// Create the context with a default value
const HallContext = createContext<HallContextType | undefined>(undefined);

// Props for the provider component
interface HallProviderProps {
  children: ReactNode;
  initialHalls?: Hall[];
}

// Reusable HallProvider component
const HallProvider: React.FC<HallProviderProps> = ({ children, initialHalls = [] }) => {
  const [halls, setHalls] = useState<Hall[]>(initialHalls);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { fetchHalls: apiFetchHalls, addHall: apiAddHall, updateHall: apiUpdateHall, removeHall: apiRemoveHall } = useHallApi();

  const fetchHalls = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedHalls = await apiFetchHalls();
      setHalls(fetchedHalls);
    } catch (err) {
      const errorMessage = err instanceof AxiosError ? err.message : 'Failed to fetch halls';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const addHall = async (hall: Omit<Hall, 'id'>) => {
    setIsLoading(true);
    setError(null);
    try {
      const newHall = await apiAddHall(hall);
      setHalls((prevHalls) => [...prevHalls, newHall]);
    } catch (err) {
      const errorMessage = err instanceof AxiosError ? err.message : 'Failed to add hall';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const updateHall = async (updatedHall: Partial<Hall>) => {
    setIsLoading(true);
    setError(null);
    try {
      const updated = await apiUpdateHall(updatedHall);
      setHalls((prevHalls) =>
        prevHalls.map((hall) => (hall.id === updatedHall.id ? updated : hall))
      );
    } catch (err) {
      const errorMessage = err instanceof AxiosError ? err.message : 'Failed to update hall';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const removeHall = async (id: string) => {
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
  };

  return (
    <HallContext.Provider value={{ halls, isLoading, error, fetchHalls, addHall, updateHall, removeHall }}>
      {children}
    </HallContext.Provider>
  );
};

export {
    HallContext, HallProvider
}