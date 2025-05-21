import LayoutContainer from "@/components/shared/layout-container.tsx";
import {Outlet} from "react-router-dom";
import {LayoutDashboard} from "lucide-react";
import {useEffect, useState} from "react";
import useProduct from "@/hooks/useProduct.ts";
import {ProductOutputDTO} from "@/types";

const DashboardLayoutPage = () => {
    const { getProducts } = useProduct();
    const [allProducts, setAllProducts] = useState<ProductOutputDTO[]>([]);
    useEffect(() => {
        getProducts().then(allProducts => {
            setAllProducts(allProducts ?? []);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <LayoutContainer className="h-full relative">
            <div className="absolute inset-0 z-0 flex items-center justify-center">
                <LayoutDashboard className="w-96 h-96 text-indigo-600/5 "/>
            </div>
            <Outlet context={allProducts} />
        </LayoutContainer>
    );
};

export default DashboardLayoutPage;
