import {ButtonType, CategoryInputDTO, CategoryOutputDTO} from "@/types";
import {useState} from "react";
import {cn} from "@/utils";
import Card from "@/components/shared/card.tsx";
import CategoryForm from "./category-form";
import {Button} from "@/components/ui";

type CategoryNewFormCardProps = {
    onSubmit: (category: CategoryInputDTO) => Promise<unknown>;
    value?: CategoryOutputDTO;
    defaultParentId: string;
    className?: string;
}

export default function CategoryNewFormCard({ onSubmit, value, className, defaultParentId }: Readonly<CategoryNewFormCardProps>) {
    const [formRef, setFormRef] = useState<HTMLFormElement | null>(null);

    return (
        <Card
            title={"Neue Kategorie"}
            className={cn("w-full xl:max-w-2xl", className)}
            actions={
            <div className={"flex justify-end items-center"}>
                <Button type={ButtonType.button} onClick={() => formRef?.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }))} className="rounded w-fit h-fit bg-gray-600 px-4 py-2 text-sm text-white data-hover:bg-gray-500 data-hover:data-active:bg-gray-700">
                    hinzufügen
                </Button>
            </div>
            }
        >
            <CategoryForm onSubmit={onSubmit} value={value} defaultParentId={defaultParentId} setFormRef={setFormRef}/>
        </Card>
    )

}