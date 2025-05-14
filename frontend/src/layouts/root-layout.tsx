import {FC, PropsWithChildren} from "react";
import {Outlet} from "react-router-dom";
import {footerConfig, sidebarItemsConfig} from "../../data/navigations-data.ts";
import LayoutContainer from "@/components/shared/layout-container.tsx";
import Header from "@/components/layout/header.tsx";
import Sidebar from "@/components/layout/sidebar.tsx";
import Footer from "@/components/layout/footer.tsx";

const RootLayout: FC<PropsWithChildren> = () => {
    return (
        <>
            <Sidebar sidebarItems={sidebarItemsConfig} />
            <LayoutContainer className={"relative"}>
                <Header />
                <main className={"flex-1 w-full relative pt-16"}>
                    <Outlet/>
                </main>
                <Footer footerItems={footerConfig}/>
            </LayoutContainer>
        </>
    )
}

export default RootLayout;