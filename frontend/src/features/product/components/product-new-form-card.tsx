import {ButtonType, ProductInputDTO, ProductOutputDTO} from "@/types";
import {useState} from "react";
import {cn} from "@/utils";
import Card from "@/components/shared/card.tsx";
import ProductForm from "./product-form";
import {Button} from "@/components/ui";

type ProductNewFormCardProps = {
    onSubmit: (product: ProductInputDTO) => Promise<unknown>;
    value?: ProductOutputDTO;
    defaultCategoryId: string;
    className?: string;
}

export default function ProductNewFormCard({ onSubmit, value, className, defaultCategoryId }: Readonly<ProductNewFormCardProps>) {
    const [formRef, setFormRef] = useState<HTMLFormElement | null>(null);
    return (
        <Card
            title={"Neues Produkt"}
            className={cn("w-full lg:max-w-2xl", className)}
            actions={
                <div className={"flex justify-end w-full items-center"}>
                    <Button type={ButtonType.button}
                            onClick={() => formRef?.current?.dispatchEvent(new Event("submit", {
                                cancelable: true,
                                bubbles: true
                            }))}
                            className="rounded w-fit h-fit bg-gray-600 px-4 py-2 text-sm text-white data-hover:bg-gray-500 data-hover:data-active:bg-gray-700">
                        hinzufügen
                    </Button>
                </div>}
        >
            <ProductForm
                onSubmit={onSubmit}
                value={value}
                defaultCategoryId={defaultCategoryId}
                setFormRef={setFormRef}
            />
        </Card>
    )
}