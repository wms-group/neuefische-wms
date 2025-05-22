import {useState} from "react";
import {Transition} from "@headlessui/react";
import {OrderDto} from "@/types";
import LayoutContainer from "@/components/shared/layout-container";
import {StatusBadge} from "@/components/ui/status-badge";
import {PillSkeleton} from "@/components/ui";
import {cn} from "@/utils";

const LIMIT_OPTIONS = [5, 10, 15, "all"] as const;
type LimitOption = typeof LIMIT_OPTIONS[number];

const RecentOrdersTable = ({orders, isLoading}: { orders: OrderDto[]; isLoading: boolean }) => {
    const [limit, setLimit] = useState<LimitOption>(10);

    const displayedOrders = limit === "all" ? orders : orders.slice(0, limit);

    return (
        <LayoutContainer className="bg-transparent">
            <div className="flex flex-wrap items-center justify-between mt-8 mb-4 gap-4 max-w-[70rem] mx-auto w-full">
                <h2 className="text-xl font-semibold">Recent Orders</h2>
                <div className="flex items-center gap-2 flex-wrap">
                    {LIMIT_OPTIONS.map((val) => (
                        <label key={val}>
                            <input
                                type="radio"
                                name="orderLimit"
                                value={val}
                                checked={limit === val}
                                onChange={() => setLimit(val)}
                                className="sr-only"
                            />
                            <span className={cn("cursor-pointer text-sm px-3 py-1 rounded-full border transition-all"
                                , limit === val
                                    ? "bg-primary text-white border-primary"
                                    : "bg-transparent border-secondary text-gray-600 hover:bg-primary/10"
                            )}>{val === "all" ? "All" : val}</span></label>
                    ))}
                </div>
            </div>

            <div className="overflow-x-auto flex items-center justify-center max-w-[70rem] mx-auto w-full">
                <table className="min-w-full text-sm">
                    <thead>
                    <tr className="text-left border-b border-secondary">
                        <th className="py-3 px-4 w-96">Products</th>
                        <th className="py-3 px-2">Total Items</th>
                        {/* px-2 statt px-4 */}
                        <th className="py-3 px-2">Ordered At</th>
                        {/* Umbenannt + px-2 */}
                        <th className="py-3 px-2 text-right">Status</th>
                        {/* px-2 statt px-4 */}
                    </tr>
                    </thead>

                    {isLoading ? (
                        <tbody>
                        {[...Array(5)].map((_, index) => (
                            <tr key={index} className="border-b border-secondary last:border-b-0 animate-pulse">
                                <td className="py-3 px-4">
                                    <div className="h-4 w-48 bg-primary rounded"/>
                                </td>
                                <td className="py-3 px-2">
                                    <div className="h-4 w-10 bg-primary rounded"/>
                                </td>
                                <td className="py-3 px-2">
                                    <div className="h-4 w-20 bg-primary rounded"/>
                                </td>
                                <td className="py-3 px-2 text-right">
                                    <div className="inline-block">
                                        <PillSkeleton/>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    ) : (
                        <Transition
                            as="tbody"
                            show={!isLoading}
                            enter="transition-opacity duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                        >
                            {displayedOrders.map((order, i) => {
                                const totalItems = order.wares.reduce((sum, item) => sum + item.amount, 0);
                                const productNames = order.wares.map((w) => w.product.name).join(", ");
                                const isLast = i === displayedOrders.length - 1;

                                return (
                                    <tr
                                        key={order.id}
                                        className={`border-b border-secondary hover:bg-element-bg transition ${
                                            isLast ? "last:border-b-0" : ""
                                        }`}
                                    >
                                        <td className="py-3 px-4 max-w-[300px] truncate font-medium">{productNames}</td>
                                        <td className="py-3 px-2">{totalItems}</td>
                                        <td className="py-3 px-2">{new Date(order.createdAt).toLocaleDateString()}</td>
                                        <td className="py-3 px-2 text-right">
                                            <StatusBadge status={order.status}/>
                                        </td>
                                    </tr>
                                );
                            })}
                        </Transition>
                    )}
                </table>
            </div>
        </LayoutContainer>
    );
};

export default RecentOrdersTable;
