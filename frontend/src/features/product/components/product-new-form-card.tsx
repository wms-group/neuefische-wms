import {ButtonType, ProductInputDTO, ProductOutputDTO} from "@/types";
import {useState} from "react";
import {cn} from "@/utils";
import Card from "@/components/shared/card.tsx";
import ProductForm from "./product-form";
import {Button} from "@/components/ui";

type ProductNewFormCardProps = {
    onSubmit: (product: ProductInputDTO) => Promise<unknown>;
    value?: ProductOutputDTO;
    disabled?: boolean;
    defaultCategoryId: string;
    className?: string;
}

export default function ProductNewFormCard({ onSubmit, value, disabled, className, defaultCategoryId }: Readonly<ProductNewFormCardProps>) {
    const [formRef, setFormRef] = useState<HTMLFormElement | null>(null);
    return (
        <Card
            title={"Neues Produkt"}
            className={cn(className, disabled && "opacity-50 cursor-not-allowed")}
            actions={
                <div className={"flex justify-end w-full items-center"}>
                    <Button type={ButtonType.button}
                            onClick={() => formRef?.dispatchEvent(new Event("submit", {
                                cancelable: true,
                                bubbles: true
                            }))}
                            disabled={disabled}
                            className={cn(
                                "w-full grow-1 sm:w-fit sm:grow-0 rounded bg-gray-600 px-4 py-2 text-sm text-white data-hover:bg-gray-500 data-hover:data-active:bg-gray-700",
                                disabled && "opacity-50 cursor-not-allowed")}>
                        hinzufügen
                    </Button>
                </div>}
        >
            <ProductForm
                onSubmit={onSubmit}
                value={value}
                disabled={disabled}
                defaultCategoryId={defaultCategoryId}
                setFormRef={setFormRef}
            />
        </Card>
    )
}