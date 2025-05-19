import {ProductInputDTO, ProductOutputDTO} from "@/types";
import {ProductCard} from "@/features/product";
import {cn} from "@/utils";

export type ProductListProps = {
    products: ProductOutputDTO[]
    onSubmit?: (submittedProduct: ProductInputDTO, productId: string) => Promise<unknown>;
    onDelete?: (productId: string) => Promise<unknown>;
    className?: string;
    categoryId?: string | null;
};

export default function ProductList({products, onSubmit, onDelete, categoryId, className}: ProductListProps = {
    products: []
}) {
    return (
        <div className={cn("product-list flex flex-col gap-2", className)}>
            { products
                .filter(product => categoryId === undefined || product.categoryId === categoryId)
                .map(product => (
                        <div key={product.id} className="product-list-item">
                            <ProductCard
                                product={product}
                                onSubmit={onSubmit}
                                onDelete={onDelete}
                            />
                        </div>
                )
                )}
        </div>
    )
}