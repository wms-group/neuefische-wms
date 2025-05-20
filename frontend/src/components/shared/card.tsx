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
        <div className={cn("flex flex-col h-full min-h-46 justify-start py-2 px-4 rounded-lg bg-element-bg gap-2", className)}>
            {title && <div className="text-lg align-top text basis-full">{title}</div>}
            <div className={cn("basis-full grow", contentClassName)}>{children}</div>
            {actions && actions}
        </div>
    )
}

export default Card;