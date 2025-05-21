import LayoutContainer from "@/components/shared/layout-container.tsx";
import {Outlet} from "react-router-dom";
import {LayoutDashboard} from "lucide-react";

const DashboardLayoutPage = () => {
    return (
        <LayoutContainer className="h-full relative">
            <div className="absolute inset-0 z-0 flex items-center justify-center">
                <LayoutDashboard className="w-96 h-96 text-indigo-600/5 "/>
            </div>
            <Outlet />
        </LayoutContainer>
    );
};

export default DashboardLayoutPage;
