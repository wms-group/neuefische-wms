import {ProductInputDTO, ProductOutputDTO} from "@/types";
import {useRef} from "react";
import {cn} from "@/utils";
import Card from "@/components/shared/card.tsx";
import ProductForm from "./product-form";

type ProductNewFormCardProps = {
    onSubmit: (product: ProductInputDTO) => Promise<unknown>;
    value?: ProductOutputDTO;
    defaultCategoryId: string;
    className?: string;
}

export default function ProductNewFormCard({ onSubmit, value, className, defaultCategoryId }: Readonly<ProductNewFormCardProps>) {
    const formRef = useRef<HTMLFormElement>(null);

    return (
        <Card
            title={"Neues Produkt"}
            className={cn(className, "max-w-2xl")}
            /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
            actions={<button type="button" onClick={_e => formRef.current?.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }))} className="rounded w-fit h-fit bg-gray-600 px-4 py-2 text-sm text-white data-hover:bg-gray-500 data-hover:data-active:bg-gray-700">
                hinzufügen
            </button>}
        >
            <ProductForm onSubmit={onSubmit} value={value} defaultCategoryId={defaultCategoryId} formRef={formRef}/>
        </Card>
    )

}