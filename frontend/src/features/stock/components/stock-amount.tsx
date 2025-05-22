import {useEffect, useState} from "react";
import {StockItemDto} from "@/types";
import {getStockAmountByProductId} from "@/features/stock/api";

const StockAmount = ({productId}: {productId: string}) => {
    const [stockItem, setStockItem] = useState<StockItemDto | null>(null);

    useEffect(() => {
        if (productId) {
        (async () => {
            try {
                const data = await getStockAmountByProductId(productId);
                setStockItem(data);
            } catch (error) {
                console.error("Failed to fetch stock amount", error);
            }
        })();


        }
    }, [productId]);

    if (!stockItem) return <div>Loading...</div>;

    return (
        <div>
            <h3>Product: {stockItem.product?.name}</h3>
            <p>Amount in stock: {stockItem.amount}</p>
        </div>
    );
};

export default StockAmount;