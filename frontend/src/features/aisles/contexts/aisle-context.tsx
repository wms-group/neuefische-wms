import React, { createContext, useState, ReactNode } from 'react';
import { AxiosError } from 'axios';
import { Aisle, AisleContextType } from '../types/aisle';
import { useAisleApi } from '../api/aisle-api';

// Create the context with a default value
const AisleContext = createContext<AisleContextType | undefined>(undefined);

// Props for the provider component
interface AisleProviderProps {
  children: ReactNode;
  initialHalls?: Aisle[];
}

// Reusable AisleProvider component
const AisleProvider: React.FC<AisleProviderProps> = ({ children, initialHalls = [] }) => {
  const [halls, setHalls] = useState<Aisle[]>(initialHalls);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { fetchHalls: apiFetchHalls, addHall: apiAddHall, updateHall: apiUpdateHall, removeHall: apiRemoveHall } = useAisleApi();

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

  const addHall = async (hall: Omit<Aisle, 'id'>) => {
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

  const updateHall = async (updatedHall: Partial<Aisle>) => {
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
    <AisleContext.Provider value={{ halls, isLoading, error, fetchHalls, addHall, updateHall, removeHall }}>
      {children}
    </AisleContext.Provider>
  );
};

export {
    AisleContext, AisleProvider
}