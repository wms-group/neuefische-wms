import {useContext} from "react";
import ProductContext from "@/context/products/product-context.ts";

export function useProductContext() {
    const ctx = useContext(ProductContext);
    if (!ctx) throw new Error("useProductContext muss innerhalb von ProductProvider verwendet werden!");
    return ctx;
}