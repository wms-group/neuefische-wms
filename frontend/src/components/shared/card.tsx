import {cn} from "@/utils";
import {PropsWithChildren} from "react";

type CategoryCardProps = PropsWithChildren<{
    title: React.ReactNode;
    actions?: React.ReactNode;
    className?: string;
}>

const Card = ({title, actions, children, className}: CategoryCardProps) => {
    return (
        <div className={cn("card flex flex-col gap-2", className)}>
            {title && <div className="text-lg align-top text basis-full">{title}</div>}
            <div className="basis-full grow">{children}</div>
            {<div className="mt-4 pt-3 border-t border-gray-300 flex justify-end w-full">{actions}</div>}
        </div>
    )
}

export default Card;