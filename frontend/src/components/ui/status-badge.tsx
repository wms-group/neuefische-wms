import {OrderStatusWithSkeleton} from "@/types";
import {cn} from "@/utils";

const statusStyles: Record<OrderStatusWithSkeleton, string> = {
    PENDING: "bg-yellow-100 text-yellow-700",
    PROCESSING: "bg-blue-100 text-blue-700",
    SHIPPED: "bg-purple-100 text-purple-700",
    DELIVERED: "bg-green-100 text-green-700",
    CANCELED: "bg-red-100 text-red-700",
    SKELETON: "bg-primary animate-pulse"
};

export const StatusBadge = ({ status }: { status: OrderStatusWithSkeleton }) => {
    return (
        <span
            className={cn(
                "text-sm font-semibold px-3 py-1 rounded-full inline-block self-start",
                statusStyles[status],
                status === "SKELETON" && "w-16 h-6"
            )}
        >
      {status !== "SKELETON" && status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}
    </span>
    );
};
