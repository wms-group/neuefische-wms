import {createContext} from "react";
import {useProductApi} from "@/hooks/useProduct.ts";

type ProductContextType = useProductApi;

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export default ProductContext;
