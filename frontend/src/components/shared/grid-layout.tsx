import {FC} from "react";
import {GridLayoutProps} from "@/types";
import {buildGridCols, cn} from "@/utils";

const GridLayout: FC<GridLayoutProps> = ({children, className, gap = "gap-3", gridCols}) => {
    const gridClass = buildGridCols(gridCols);
    return (
        <div className={cn("grid", gridClass, gap, className)}>{children}</div>
    )
}

export default GridLayout;