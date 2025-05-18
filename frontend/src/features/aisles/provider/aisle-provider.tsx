import { ReactNode, useCallback, useState } from "react";
import { AisleContext } from "../contexts/aisle-context";
import { Aisle } from "@/types";
import { AxiosError } from "axios";
import { useAisleApi } from "@/features/aisles";


interface AisleProviderProps {
  children: ReactNode;
  initialAisles?: Aisle[];
}

const AisleProvider: React.FC<AisleProviderProps> = ({ children, initialAisles = [] }) => {
    const [aisles, setAisles] = useState<Aisle[]>(initialAisles);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { fetchAisles: apiFetchAisles, fetchAisle: apiFetchAisle, addAisle: apiAddAisle, updateAisle: apiUpdateAisle, removeAisle: apiRemoveAisle } = useAisleApi();

    const fetchAisles = useCallback(async ():Promise<Aisle[] | undefined> => {
        setIsLoading(true);
        setError(null);
        try {
            const fetchedAisles = await apiFetchAisles();
            setAisles(fetchedAisles);
            return fetchedAisles;
        } catch (err) {
            const errorMessage = err instanceof AxiosError ? err.message : 'Failed to fetch halls';
            setError(errorMessage);
            return undefined;
        } finally {
            setIsLoading(false);
        }
    }, [apiFetchAisles]);

    const fetchAisle = useCallback(async (id: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const fetchedAisle = await apiFetchAisle(id);
            setAisles((prevAisles) => [...prevAisles.filter(a => a.id !== fetchedAisle.id), fetchedAisle]);
            return fetchedAisle;
        } catch (err) {
            const errorMessage = err instanceof AxiosError ? err.message : 'Failed to fetch halls';
            setError(errorMessage);
            return undefined;
        } finally {
            setIsLoading(false);
        }
    }, [apiFetchAisle]);

    const addAisle = async (hall: Omit<Aisle, 'id'>): Promise<Aisle | undefined> => {
        setIsLoading(true);
        setError(null);
        try {
            const newAisle = await apiAddAisle(hall);
            setAisles((prevAisles) => [...prevAisles, newAisle]);
            return newAisle;
        } catch (err) {
            const errorMessage = err instanceof AxiosError ? err.message : 'Failed to add hall';
            setError(errorMessage);
            return undefined;
        } finally {
            setIsLoading(false);
        }
    };

    const updateAisle = async (updatedAisle: Partial<Aisle>): Promise<Aisle | undefined> => {
        setIsLoading(true);
        setError(null);
        try {
            const updated = await apiUpdateAisle(updatedAisle);
            setAisles((prevAisles) =>
                prevAisles.map((hall) => (hall.id === updatedAisle.id ? updated : hall))
            );
            return updated;
        } catch (err) {
            const errorMessage = err instanceof AxiosError ? err.message : 'Failed to update hall';
            setError(errorMessage);
            return undefined;
        } finally {
            setIsLoading(false);
        }
    };

    const removeAisle = async (id: string) => {
        setIsLoading(true);
        setError(null);
        try {
            await apiRemoveAisle(id);
            setAisles((prevAisles) => prevAisles.filter((hall) => hall.id !== id));
        } catch (err) {
            const errorMessage = err instanceof AxiosError ? err.message : 'Failed to delete hall';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AisleContext.Provider value={{ aisles, isLoading, error, fetchAisles, fetchAisle, addAisle, updateAisle, removeAisle }}>
            {children}
        </AisleContext.Provider>
    );
};

export default AisleProvider;