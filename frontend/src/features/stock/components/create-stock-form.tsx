import {createStockItem} from "@/features/stock/api";
import {StockForm} from "@/features/stock/components/stock-form.tsx";
import {ProductOutputDTO} from "@/types";

const CreateStockForm = ({ products }: { products: ProductOutputDTO[]}) => (
    <StockForm
        products={products}
        onSubmit={createStockItem}
        submitLabel="Add Stock"
    />
);
export default CreateStockForm;
