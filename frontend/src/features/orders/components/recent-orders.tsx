import {cn} from "@/utils";
import {useMemo} from "react";
import {OrderStatus, RecentOrdersProps} from "@/types";
import LayoutContainer from "@/components/shared/layout-container.tsx";

const statusColors: Record<OrderStatus, string> = {
    Delivered: "bg-green-100 text-green-700",
    Pending: "bg-yellow-100 text-yellow-700",
    Canceled: "bg-red-100 text-red-700",
};

const RecentOrdersTable = ({orders}: RecentOrdersProps) => {
    const sortedOrders = useMemo(() =>
        [...orders].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 5), [orders]);

    return (
        <LayoutContainer className="card bg-transparent inset-shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>

            <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                    <thead>
                    <tr className="text-left border-b border-secondary">
                        <th className="py-3 px-4">Products</th>
                        <th className="py-3 px-4">Category</th>
                        <th className="py-3 px-4">Price</th>
                        <th className="py-3 px-4">Status</th>
                    </tr>
                    </thead>
                    <tbody>
                    {sortedOrders.map(({product, status}, index) => (
                        <tr key={product.id + index}
                            className="not-last:border-b border-secondary hover:bg-element-bg transition">
                            <td className="py-3 px-4 flex items-center space-x-3">
                                <img src={product.imageUrl} alt={product.name}
                                     className="w-10 h-10 rounded object-cover"/>
                                <div>
                                    <div className="font-medium">{product.name}</div>
                                    <div
                                        className="text-xs text-gray-500">{product.variants} Variant{product.variants > 1 ? "s" : ""}</div>
                                </div>
                            </td>
                            <td className="py-3 px-4">{product.category}</td>
                            <td className="py-3 px-4">${product.price.toFixed(2)}</td>
                            <td className="py-3 px-4">
                  <span
                      className={cn(
                          "inline-block px-3 py-0.5 rounded-full text-xs font-medium",
                          statusColors[status]
                      )}
                  >
                    {status}
                  </span>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </LayoutContainer>
    );
};


export default RecentOrdersTable;