import {StockForm} from "@/features/stock/components/stock-form.tsx";
import {deleteStockItem} from "@/features/stock/api";
import {DeleteIcon} from "lucide-react";
import {ProductOutputDTO} from "@/types";

const DeleteStockForm  = ({ products }: { products: ProductOutputDTO[]}) => (
    <StockForm
        products={products}
        onSubmit={deleteStockItem}
        submitLabel="Remove Stock"
        submitClassName="bg-red-400 text-white hover:bg-red-500"
        iconAfter={<DeleteIcon />}
    />
);
export default DeleteStockForm;
