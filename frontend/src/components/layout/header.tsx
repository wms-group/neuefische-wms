import {SidebarOpen} from "lucide-react";
import {useSidebar} from "@/context/sidebar/useSidebar.ts";
import {Button} from "@/components/ui";

const Header = () => {
    const {toggleSidebar} = useSidebar();
    return (
        <header className="fixed top-0 h-16 w-full lg:w-[calc(100%-16rem)] flex items-center justify-between px-5 lg:px-20 bg-element-bg border-b border-secondary shadow-lg z-50">
            <div className="flex items-center gap-2">
                <Button
                    className="bg-transparent p-2 lg:hidden"
                    iconAfter={true}
                    onClick={toggleSidebar}
                >
                     <SidebarOpen size={20}/>

                </Button>
                <h1>SEARCH</h1>
            </div>
            <div>
                <p>LOG-IN</p>
            </div>
        </header>
    )
}

export default Header;