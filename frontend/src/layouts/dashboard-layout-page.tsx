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
            <LayoutDashboard className="absolute top-1/2 left-1/2 z-0 w-96 h-96 text-indigo-600/5 -translate-x-1/2 -translate-y-1/2" />
            <Outlet context={allProducts} />
        </LayoutContainer>
    );
};

export default DashboardLayoutPage;
