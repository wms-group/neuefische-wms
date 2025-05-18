import { createContext } from "react";
import { AisleContextType } from "@/types";


export const AisleContext = createContext<AisleContextType | undefined>(undefined);