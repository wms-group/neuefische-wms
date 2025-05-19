import {GridLayoutProps, ProductOutputDTO} from "@/types";
import {ProductCard} from "@/features/product";
import {cn} from "@/utils";
import GridLayout from "@/components/shared/grid-layout.tsx";

export type ProductListProps = {
    products: ProductOutputDTO[]
    className?: string;
    categoryId?: string | null;
    gridCols?: GridLayoutProps["gridCols"];
};

export default function ProductList({products, categoryId, gridCols,className}: ProductListProps = {
    products: []
}) {
    return (
        <GridLayout gridCols={gridCols} className={cn(className)}>
            { products
                .filter(product => categoryId === undefined || product.categoryId === categoryId)
                .map(product => (
                        <div key={product.id} className="product-list-item">
                            <ProductCard
                                product={product}
                                className={"max-w-none"}
                            />
                        </div>
                )
                )}
        </GridLayout>
    )
}