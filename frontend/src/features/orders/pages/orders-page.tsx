import {OrderDto, ProductOutputDTO} from "@/types";
import {useEffect, useState} from "react";
import {deleteOrder, getOrders} from "@/features/orders/api";
import OrderForm from "@/features/orders/components/create-order-form";
import OrderItem from "@/features/orders/components/order-item";
import GridLayout from "@/components/shared/grid-layout";
import {cn} from "@/utils";
import useProduct from "@/hooks/useProduct.ts";
import OrderItemSkeleton from "@/features/orders/components/order-item-skeleton.tsx";

const OrdersPage = () => {
    const [orders, setOrders] = useState<(OrderDto & { id: string })[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [allProducts, setAllProducts] = useState<ProductOutputDTO[]>([]);
    const { getProducts } = useProduct();

    const handleCreate = (newOrder: OrderDto & { id: string }) => {
        setOrders((prev) => [newOrder, ...prev]);
    };

    const handleUpdate = (updatedOrder: OrderDto & { id: string }) => {
        setOrders((prev) =>
            prev.map((o) => (o.id === updatedOrder.id ? updatedOrder : o))
        );
    };

    const handleDelete = async (id: string) => {
        await deleteOrder(id);
        setOrders((prev) => prev.filter((o) => o.id !== id));
    };

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                const orders = await getOrders();
                const sorted = (orders as (OrderDto & { id: string })[]).sort((a, b) => {
                    const updatedDiff = new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
                    if (updatedDiff !== 0) return updatedDiff;

                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                });

                setOrders(sorted);
            } catch (error) {
                console.error("Fehler beim Laden der Bestellungen:", error);
            } finally {
                setLoading(false);
            }
        })()
    }, []);

    useEffect(() => {
        getProducts().then(allProducts => {
            setAllProducts(allProducts ?? []);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <div className="space-y-8">
            <OrderForm
                products={allProducts}
                onCreate={handleCreate}
                className={cn(loading && "cursor-not-allowed pointer-events-none")}
            />

            <GridLayout gridCols={{ base: 1, sm: 1, md: 1, lg:1, xl: 3 }}>
                {!loading && orders && orders.map((order) => (
                    <OrderItem
                        products={allProducts}
                        key={order.id}
                        order={order}
                        onUpdate={handleUpdate}
                        onDelete={handleDelete}
                    />
                ))}

                {loading && (
                    [...Array(3)].map((_, index) => (
                        <OrderItemSkeleton key={index} />
                    ))
                )}
            </GridLayout>
        </div>
    );
};

export default OrdersPage;
