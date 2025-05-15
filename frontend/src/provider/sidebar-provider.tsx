import {FC, PropsWithChildren, useEffect, useState} from "react";
import {SidebarContext} from "@/context/sidebar/siderbar-context.tsx";

export const SidebarProvider: FC<PropsWithChildren> = ({children}) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const toggleSidebar = () => setIsOpen(prev => !prev);
    const closeSidebar = () => setIsOpen(false);

    useEffect(() => {
        /* using window.matchMedia, that when the screen is LG and above closes automatically */
        const mediaQuery = window.matchMedia("(min-width: 1024px)");

        /*function for changing the state*/
        const handleResize = () => {
            if (mediaQuery.matches) {
                setIsOpen(false)
            }
        }

        /*checking initially */
        handleResize();

        mediaQuery.addEventListener("change", handleResize);

        /*cleanup function removing eventListener*/
        return () => {
            mediaQuery.removeEventListener("change", handleResize);
        }
    }, []);

    return (
        <SidebarContext.Provider value={{isOpen, toggleSidebar, closeSidebar}}>
            {children}
        </SidebarContext.Provider>
    )
}