import {Outlet} from "react-router-dom";
import LayoutContainer from "@/components/shared/layout-container.tsx";

const UserLayout = () => {
    return (
        <LayoutContainer className="block h-full bg-settings">
            <Outlet/>
        </LayoutContainer>
    );
};

export default UserLayout;