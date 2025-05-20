import { AisleContextType } from "@/types";
import { useContext } from "react";
import { AisleContext } from "../contexts/aisle-context";

export const useAisles = (): AisleContextType => {
  const context = useContext(AisleContext);
  if (!context) {
    throw new Error('useAisles must be used within a AisleProvider');
  }
  return context;
};