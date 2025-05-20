import {Outlet} from "react-router-dom";
import AisleProvider from "@/features/aisles/provider/aisle-provider";

const AisleLayout = () => {
    return (
        <AisleProvider>
            <Outlet />
        </AisleProvider>
    )
}

export default AisleLayout;