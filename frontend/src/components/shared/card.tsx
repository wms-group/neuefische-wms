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
        <div className={cn("card flex flex-col gap-2", className)}>
            {title && <div className="text-lg align-top text basis-full">{title}</div>}
            <div className={cn("basis-full grow", contentClassName)}>{children}</div>
            {actions && <div className="card-actions pt-2 justify-self-end border-t h-fit border-gray-400 shrink basis-1 w-full flex flex-col items-end">{actions}</div>}
        </div>
    )
}

export default Card;