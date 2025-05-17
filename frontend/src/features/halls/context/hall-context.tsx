import { createContext } from "react";
import { HallContextType } from "@/types";

export const HallContext = createContext<HallContextType | undefined>(undefined);