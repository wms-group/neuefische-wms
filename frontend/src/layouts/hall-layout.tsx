import HallProvider from "@/features/halls/provider/hall-provider";
import {Outlet} from "react-router-dom";

const HallLayout = () => {
    return (
        <HallProvider>
            <Outlet />
        </HallProvider>
    )
}

export default HallLayout;