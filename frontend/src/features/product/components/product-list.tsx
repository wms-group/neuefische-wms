import {ProductInputDTO, ProductOutputDTO} from "@/types";
import {ProductCard} from "@/features/product";


export type ProductListProps = {
    products: ProductOutputDTO[]
    onSubmit?: (submittedProduct: ProductInputDTO, productId: string) => Promise<unknown>;
    onDelete?: (productId: string) => Promise<unknown>;
    categoryId?: string | null;
};

export default function ProductList({products, onSubmit, onDelete, categoryId}: ProductListProps = {
    products: []
}) {
    return (
        <>
            {products
                .filter(product => categoryId === undefined || product.categoryId === categoryId)
                .map(product => (
                        <div key={product.id} className="product-list-item">
                            <ProductCard
                                product={product}
                                onSubmit={onSubmit}
                                onDelete={onDelete}
                                className="xl:max-w-2xl"
                            />
                        </div>
                    )
                )}
        </>
    )
}