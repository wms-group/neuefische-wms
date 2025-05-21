import {OrderDto} from "@/types";
import {useEffect, useState} from "react";
import {deleteOrder, getOrders} from "@/features/orders/api";
import OrderForm from "@/features/orders/components/create-order-form";
import OrderItem from "@/features/orders/components/order-item";
import GridLayout from "@/components/shared/grid-layout";

const OrdersPage = () => {
    const [orders, setOrders] = useState<(OrderDto & { id: string })[]>([]);
    const [loading, setLoading] = useState(true);

    const loadOrders = async () => {
        setLoading(true);
        const data = await getOrders();

        const sorted = (data as (OrderDto & { id: string })[]).sort((a, b) => {
            const updatedDiff = new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
            if (updatedDiff !== 0) return updatedDiff;

            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });

        setOrders(sorted);
        setLoading(false);
    };

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
        loadOrders();
    }, []);

    if (loading) return <p>Loading orders...</p>;

    return (
        <div className="space-y-8">
            <OrderForm onCreate={handleCreate} />
            <GridLayout gridCols={{ base: 1, sm: 2, md: 2, xl: 3 }}>
                {orders.map((order) => (
                    <OrderItem
                        key={order.id}
                        order={order}
                        onUpdate={handleUpdate}
                        onDelete={handleDelete}
                    />
                ))}
            </GridLayout>
        </div>
    );
};

export default OrdersPage;
