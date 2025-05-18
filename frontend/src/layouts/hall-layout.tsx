import AisleProvider from "@/features/aisles/provider/aisle-provider";
import HallProvider from "@/features/halls/provider/hall-provider";
import {Outlet} from "react-router-dom";

const HallLayout = () => {
    return (
        <HallProvider>
            <AisleProvider>
                <Outlet />
            </AisleProvider>
        </HallProvider>
    )
}

export default HallLayout;