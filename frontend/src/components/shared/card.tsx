import {cn} from "@/utils";
import {PropsWithChildren} from "react";

type CategoryCardProps = PropsWithChildren<{
    title: React.ReactNode;
    actions?: React.ReactNode;
    className?: string;
    contentClassName?: string;
}>

const Card = ({title, actions, children, className, contentClassName}: CategoryCardProps) => {
    return (
        <div className={cn("flex flex-col h-full min-h-32 justify-start py-2 px-4 rounded-lg bg-gray-300/10 gap-2 flex-wrap", className)}>
            {title && <div className="text-lg align-top text basis-full">{title}</div>}
            <div className={cn("basis-full grow", contentClassName)}>{children}</div>
            {actions && <div className="card-actions pt-2 justify-self-end border-t h-fit border-gray-400 shrink basis-1 w-full flex flex-col items-end">{actions}</div>}
        </div>
    )
}

export default Card;