import {CategoriesProvider} from "@/context/CategoriesProvider.tsx";
import {Outlet} from "react-router-dom";

const CategoriesProductsLayout = () => {
    return (
        <CategoriesProvider>
            <Outlet />
        </CategoriesProvider>
    )
}

export default CategoriesProductsLayout;