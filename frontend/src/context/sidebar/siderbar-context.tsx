import {createContext} from "react";
import {SidebarContextType} from "@/types";

export const SidebarContext = createContext<SidebarContextType | undefined>(undefined);