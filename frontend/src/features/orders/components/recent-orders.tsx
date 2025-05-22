import {OrderDto} from "@/types";
import LayoutContainer from "@/components/shared/layout-container.tsx";
import {StatusBadge} from "@/components/ui/status-badge.tsx";
import {PillSkeleton} from "@/components/ui";

const RecentOrdersTable = ({orders, isLoading}: { orders: OrderDto[], isLoading: boolean }) => {
    return (
        <LayoutContainer className="bg-transparent">
            <h2 className="mt-8">Recent Orders</h2>

            <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                    <thead>
                    <tr className="text-left border-b border-secondary">
                        <th className="py-3 px-4 w-96">Products</th>
                        <th className="py-3 px-4">Total Items</th>
                        <th className="py-3 px-4">Created</th>
                        <th className="py-3 px-4 text-right">Status</th>
                    </tr>
                    </thead>
                    <tbody>
                    {isLoading ? (
                        [...Array(5)].map((_, index) => (
                            <tr key={index}
                                className="not-last:border-b border-secondary hover:bg-element-bg transition">
                                <td className="py-3 px-4">
                                    <div className="h-4 w-48 bg-primary rounded animate-pulse"/>
                                </td>
                                <td className="py-3 px-4">
                                    <div className="h-4 w-10 bg-primary rounded animate-pulse"/>
                                </td>
                                <td className="py-3 px-4">
                                    <div className="h-4 w-20 bg-primary rounded animate-pulse"/>
                                </td>
                                <td className="py-3 px-4 text-right">
                                    <div className="inline-block">
                                        <PillSkeleton/>
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : orders.map((order) => {
                        const totalItems = order.wares.reduce((sum, item) => sum + item.amount, 0);
                        const productNames = order.wares.map(w => w.product.name).join(", ");

                        return (
                            <tr key={order.id}
                                className="not-last:border-b border-secondary hover:bg-element-bg transition">
                                <td className="py-3 px-4">
                                    <div className="font-medium truncate max-w-[300px]">{productNames}</div>
                                </td>
                                <td className="py-3 px-4">{totalItems}</td>
                                <td className="py-3 px-4">
                                    {new Date().toLocaleDateString()}
                                </td>
                                <td className="py-3 px-4 text-right">
                                    <StatusBadge status={order.status}/>
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>
        </LayoutContainer>
    );
};

export default RecentOrdersTable;
