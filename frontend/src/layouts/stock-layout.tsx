import {Outlet} from "react-router-dom";
import LayoutContainer from "@/components/shared/layout-container.tsx";

const StockLayout = () => {
    return (
        <LayoutContainer className={"h-full"}>
            <Outlet/>
        </LayoutContainer>
    )
}

export default StockLayout;