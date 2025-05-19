import {CategoriesProvider} from "@/context/CategoriesProvider.tsx";
import {Outlet} from "react-router-dom";
import {Folders} from "lucide-react";

const CategoriesProductsLayout = () => {
    return (
        <CategoriesProvider>
            <div className="absolute inset-0 z-0 flex items-center justify-center">
                <Folders className="w-96 h-96 text-indigo-600/20 "/>
            </div>
            <Outlet />
        </CategoriesProvider>
    )
}

export default CategoriesProductsLayout;