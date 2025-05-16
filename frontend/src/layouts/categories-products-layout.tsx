import {CategoriesProvider} from "@/context/CategoriesProvider.tsx";
import {Outlet} from "react-router-dom";
import {ProductProvider} from "@/provider/product-provider.tsx";

const CategoriesProductsLayout = () => {
    return (
        <CategoriesProvider>
            <ProductProvider>
                <Outlet />
            </ProductProvider>
        </CategoriesProvider>
    )
}

export default CategoriesProductsLayout;