import {FC, PropsWithChildren} from "react";
import {Outlet} from "react-router-dom";
import {footerConfig, sidebarItemsConfig} from "@data/navigations-data.ts";
import LayoutContainer from "@/components/shared/layout-container.tsx";
import Header from "@/components/layout/header.tsx";
import Sidebar from "@/components/layout/sidebar.tsx";
import Footer from "@/components/layout/footer.tsx";
import {Toaster} from "sonner";

const RootLayout: FC<PropsWithChildren> = () => {
    return (
        <>
            <Sidebar sidebarItems={sidebarItemsConfig} />
            <LayoutContainer className={"relative bg-white"}>
                <Header />
                <main className={"flex-1 relative p-4 mt-16 h-full"}>
                    <Outlet/>
                </main>
                <Footer footerItems={footerConfig}/>
                <Toaster richColors />
            </LayoutContainer>
        </>
    )
}

export default RootLayout;