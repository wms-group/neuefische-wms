import {Outlet} from "react-router-dom";
import LayoutContainer from "@/components/shared/layout-container.tsx";
import useProduct from "@/hooks/useProduct.ts";
import {useEffect, useState} from "react";
import {ProductOutputDTO} from "@/types";

const StockLayout = () => {
    const { getProducts } = useProduct();
    const [allProducts, setAllProducts] = useState<ProductOutputDTO[]>([]);
    useEffect(() => {
        getProducts().then(allProducts => {
            setAllProducts(allProducts ?? []);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <LayoutContainer className={"h-full"}>
            <Outlet context={allProducts}/>
        </LayoutContainer>
    )
}

export default StockLayout;