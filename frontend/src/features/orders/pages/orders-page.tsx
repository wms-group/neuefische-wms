import {OrderDto} from "@/types";
import {useEffect, useState} from "react";
import {deleteOrder, getOrders} from "@/features/orders/api";
import OrderForm from "@/features/orders/components/create-order-form.tsx";
import OrderItem from "@/features/orders/components/order-item.tsx";

const OrdersPage = () => {
    const [orders, setOrders] = useState<(OrderDto & { id: string })[]>([]);
    const [loading, setLoading] = useState(true);

    const loadOrders = async () => {
        setLoading(true);
        const data = await getOrders();
        setOrders(data as (OrderDto & { id: string })[]);
        setLoading(false);
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
        <div className="max-w-4xl mx-auto p-4 space-y-8">
            <OrderForm />
            <div className="grid gap-4 md:grid-cols-2">
                {orders.map((order) => (
                    <OrderItem
                        key={order.id}
                        order={order}
                        onUpdate={handleUpdate}
                        onDelete={handleDelete}
                    />
                ))}
            </div>
        </div>
    );
};

export default OrdersPage;
