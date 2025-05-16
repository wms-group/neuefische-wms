import useProduct from "@/hooks/useProduct.ts";
import ProductContext from "@/context/products/product-context.ts";

export const ProductProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  return (
    <ProductContext.Provider value={useProduct()}>
      {children}
    </ProductContext.Provider>
  );
};