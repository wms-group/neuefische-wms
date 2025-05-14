import {FC} from "react";
import {ILayoutContainer} from "@/types";
import {cn} from "@/utils";

const LayoutContainer: FC<ILayoutContainer> = ({ children, className}) => {
    return (
        <div className={cn("flex flex-col flex-1 w-full", className)}>
            {children}
        </div>
    )
}

export default LayoutContainer;