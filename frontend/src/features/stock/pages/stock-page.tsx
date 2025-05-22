import StockTabs from "@/features/stock/components/stock-tabs.tsx";
import {useEffect, useState} from "react";
import {StockItemDto} from "@/types";
import {getStocks} from "@/features/stock/api";
import GridLayout from "@/components/shared/grid-layout.tsx";
import LayoutContainer from "@/components/shared/layout-container.tsx";

const StockPage = () => {
    const [stocks, setStocks] = useState<StockItemDto[]>([])
    const [loading, setLoading] = useState<boolean>(true);
    useEffect(() => {
        (async () => {
            setLoading(true);
            try {
                const data = await getStocks();
                setStocks(data);
            } catch (error) {
                console.error("Failed to fetch stock amount", error);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    return (
        <LayoutContainer>
            <StockTabs />
            <h2 className="mt-4">Stock:</h2>
            <GridLayout className="mt-6" gridCols={{base: 1, sm: 2, md: 2, xl: 3}}>
                    {!loading && stocks.map((stock) => (
                        <div className={"card"} key={stock.id}>
                            <h3 className="tail-truncate max-w-xs">
                                Product: {stock.productId}
                            </h3>
                            <p>Amount in stock: {stock.amount}</p>
                        </div>
                    ))}

                {loading && [...Array(3)].map((_, i) => (
                    <div className="card bg-element-bg animate-pulse transition-all" key={`loading-${i}`}>
                        <h3 className="bg-primary animate-pulse mb-2">&nbsp;</h3>
                        <p className="bg-primary animate-pulse">&nbsp;</p>
                    </div>
                ))}
            </GridLayout>
        </LayoutContainer>
    );
};

export default StockPage;
