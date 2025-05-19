import {CategoryInputDTO, CategoryOutputDTO} from "@/types";
import {useRef} from "react";
import {cn} from "@/utils";
import Card from "@/components/shared/card.tsx";
import CategoryForm from "./category-form";

type CategoryNewFormCardProps = {
    onSubmit: (category: CategoryInputDTO) => Promise<unknown>;
    value?: CategoryOutputDTO;
    defaultParentId: string;
    className?: string;
}

export default function CategoryNewFormCard({ onSubmit, value, className, defaultParentId }: Readonly<CategoryNewFormCardProps>) {
    const formRef = useRef<HTMLFormElement>(null);

    return (
        <Card
            title={"Neue Kategorie"}
            className={cn(className, "max-w-2xl")}
            /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
            actions={<button type="button" onClick={_e => formRef.current?.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }))} className="rounded w-fit h-fit bg-gray-600 px-4 py-2 text-sm text-white data-hover:bg-gray-500 data-hover:data-active:bg-gray-700">
                hinzufügen
            </button>}
        >
            <CategoryForm onSubmit={onSubmit} value={value} defaultParentId={defaultParentId} formRef={formRef}/>
        </Card>
    )

}