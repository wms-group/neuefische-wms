import {ButtonType, CategoryInputDTO, CategoryOutputDTO} from "@/types";
import {useState} from "react";
import {cn} from "@/utils";
import Card from "@/components/shared/card.tsx";
import CategoryForm from "./category-form";
import {Button} from "@/components/ui";

type CategoryNewFormCardProps = {
    onSubmit: (category: CategoryInputDTO) => Promise<unknown>;
    disabled?: boolean;
    value?: CategoryOutputDTO;
    defaultParentId: string | null;
    className?: string;
}

export default function CategoryNewFormCard({ onSubmit, disabled, value, className, defaultParentId }: Readonly<CategoryNewFormCardProps>) {
    const [formRef, setFormRef] = useState<HTMLFormElement | null>(null);

    return (
        <Card
            title={"Neue Kategorie"}
            className={cn("bg-element-bg", className, disabled && "opacity-50 cursor-not-allowed")}
            actions={
            <div className={"flex justify-end items-center"}>
                <Button
                    type={ButtonType.button}
                    disabled={disabled}
                    onClick={() => formRef?.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }))}
                    className={cn(
                        "w-full grow-1 sm:w-fit sm:grow-0 rounded h-fit bg-gray-600 px-4 py-2 text-sm text-white data-hover:bg-gray-500 data-hover:data-active:bg-gray-700",
                        disabled && "opacity-50 cursor-not-allowed"
                    )
                }>
                    hinzufügen
                </Button>
            </div>
            }
        >
            <CategoryForm onSubmit={onSubmit} value={value} defaultParentId={defaultParentId} disabled={disabled} setFormRef={setFormRef}/>
        </Card>
    )

}