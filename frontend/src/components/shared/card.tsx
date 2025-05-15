import {cn} from "@/utils";
import {PropsWithChildren} from "react";

type CategoryCardProps = PropsWithChildren<{
    title: React.ReactNode;
    actions?: React.ReactNode;
    className?: string;
}>

const Card = ({title, actions, children, className}: CategoryCardProps) => {
    return (
        <div className={cn("flex justify-between p-4 border gap-1 flex-wrap", className)}>
            <div className="card-title align-top bold basis-0.5">{title}</div>
            <div className="card-content basis-0.7">{children}</div>
            {actions && <div className="card-actions align-bottom border-t grow basis-full">{actions}</div>}
        </div>
    )
}

export default Card;