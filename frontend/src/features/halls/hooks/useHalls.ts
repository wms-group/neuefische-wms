import { useContext } from "react";
import { HallContextType } from "../types/hall";
import { HallContext } from "../contexts/hall-context";

export const useHalls = (): HallContextType => {
  const context = useContext(HallContext);
  if (!context) {
    throw new Error('useHalls must be used within a HallProvider');
  }
  return context;
};