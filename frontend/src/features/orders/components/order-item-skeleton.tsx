import {Button} from "@/components/ui";
import {StatusBadge} from "@/components/ui/status-badge.tsx";
import {OrderStatusSkeleton} from "@/types";


const OrderItemSkeleton = () => {
    return (
        <div className="card p-4 rounded shadow flex flex-col gap-2 animate-pulse">
            <div className="flex justify-between items-center gap-2">
                <p>
                    Order: <strong className="bg-gray-300 rounded w-16 h-5 inline-block" />
                </p>
                <StatusBadge status={OrderStatusSkeleton.SKELETON} />
            </div>
            <div>
                <strong>Items:</strong>
                <ul className="max-h-30 overflow-y-auto pl-4 mt-2">
                    {[...Array(3)].map((_, index) => (
                        <li key={index} className="mb-1">
                            <span className="bg-gray-300 rounded w-32 h-4 block" />
                        </li>
                    ))}
                </ul>
            </div>
            <div className="flex justify-between gap-2 mt-auto">
                <Button disabled>
                    Edit
                </Button>
                <Button variant="destructive" disabled>
                    Delete
                </Button>
            </div>
        </div>
    );
};

export default OrderItemSkeleton;
