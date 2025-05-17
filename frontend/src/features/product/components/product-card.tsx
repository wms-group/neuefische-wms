import {ProductOutputDTO} from "@/types";
import Card from "@/components/shared/card.tsx";
import {cn} from "@/utils";

type ProductCardProps = {
    product: ProductOutputDTO;
    className?: string;
}

const ProductCard = ({product, className}: ProductCardProps) => {
    return (
        <Card title={product.name} actions={"not ready yet"} className={cn(className, "max-w-2xl")}>
                <div>{product.price}</div>
        </Card>
    )
}

export default ProductCard;