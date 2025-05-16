export type Aisle = {
    id: string;
    name: string;
    stockIds: string[];
}

export interface AisleContextType {
  halls: Aisle[];
  isLoading: boolean;
  error: string | null;
  fetchHalls: () => Promise<void>;
  addHall: (hall: Omit<Aisle, 'id'>) => Promise<void>;
  updateHall: (updatedHall: Partial<Aisle>) => Promise<void>;
  removeHall: (id: string) => Promise<void>;
}