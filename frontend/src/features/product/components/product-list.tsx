import {ProductOutputDTO} from "@/types";
import {ProductCard} from "@/features/product";


export type ProductListProps = {
    products: ProductOutputDTO[]
    className?: string;
    categoryId?: string | null;
};

export default function ProductList({products, categoryId}: ProductListProps = {
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
                                className={"max-w-none"}
                            />
                        </div>
                    )
                )}
        </>
    )
}