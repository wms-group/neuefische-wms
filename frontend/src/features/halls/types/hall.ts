export interface Hall {
  id: string;
  name: string;
  aisleIds: string[];
}

export interface HallContextType {
  halls: Hall[];
  isLoading: boolean;
  error: string | null;
  fetchHalls: () => Promise<void>;
  addHall: (hall: Omit<Hall, 'id'>) => Promise<void>;
  updateHall: (updatedHall: Partial<Hall>) => Promise<void>;
  removeHall: (id: string) => Promise<void>;
}