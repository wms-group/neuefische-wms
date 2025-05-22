import {SidebarOpen} from "lucide-react";
import {useSidebar} from "@/context/sidebar/useSidebar.ts";
import {Button} from "@/components/ui";
import UserAvatarAction from "@/features/user/components/user-avatar-action.tsx";
import {CreateUserAction} from "@/features/user/components/create-user-action.tsx";

const Header = () => {
    const {toggleSidebar} = useSidebar();
    return (
        <header className="fixed top-0 h-16 w-full max-w-[calc(1980px-16rem)] lg:w-[calc(100%-16rem)] flex items-center justify-between px-5 lg:px-8 bg-element-bg border-b border-r border-primary shadow-lg z-50">
            <div className="flex items-center gap-2  lg:hidden">
                <Button
                    className="bg-transparent p-2"
                    iconAfter={true}
                    onClick={toggleSidebar}
                >
                     <SidebarOpen size={20}/>

                </Button>
            </div>
            <CreateUserAction
                className="hidden lg:block"
            />
            <div
                className="h-16 lg:w-62 flex items-center justify-center [&_svg]:size-5 [&_svg]:shrink-0 relative">
                <UserAvatarAction
                    btnClassName={"p-0 hover:bg-transparent hover:cursor-pointer"}
                    userName={"Jane Doe"}
                    onLogout={() => console.log("log-out")}
                />
            </div>
        </header>
    )
}

export default Header;