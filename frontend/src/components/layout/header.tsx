import Button from "@/components/ui/button.tsx";
import {SidebarOpen} from "lucide-react";
import {useSidebar} from "@/context/sidebar/useSidebar.ts";

const Header = () => {
    const {toggleSidebar} = useSidebar();
    return (
        <header className="flex items-center justify-between h-16 transition-colors px-5 lg:px-20
        bg-gray-100 border-b-gray-300 border-b-1 sticky z-99 w-full lg:w-[calc(100vw-0.25rem*56)]">
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