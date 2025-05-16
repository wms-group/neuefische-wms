import {SidebarComponentProps} from "@/types";
import {cn} from "@/utils";
import {NavLink, useLocation} from "react-router-dom";
import UserAvatar from "@/features/user/components/user-avatar.tsx";
import {useSidebar} from "@/context/sidebar/useSidebar.ts";
import {SidebarClose, UserPlus} from "lucide-react";
import {Button} from "@/components/ui";

const Sidebar = ({sidebarItems}: SidebarComponentProps) => {
    const location = useLocation();
    const {isOpen, closeSidebar} = useSidebar()
    const {sidebarHeader, sidebarNavItems} = sidebarItems;
    return (
        <>
            {isOpen && <div
                className="absolute h-full w-full inset-0 z-98 bg-zinc-600/65 transition-opacity duration-350 ease-in-out lg:hidden"/>}
            <aside className={cn(
                "bg-gray-100 border-r border-gray-200 px-4 w-64 h-screen fixed top-0 left-0 z-999 transition-transform duration-300 ease-in-out",
                isOpen ? "translate-x-0" : "-translate-x-full",
                "lg:translate-x-0",
            )}>
                <div className="h-16 border-b-gray-300 border-b-1 p-2 flex items-center relative justify-between">
                    <p className="text-xl font-bold text-center flex-1 overflow-x-auto">{sidebarHeader.logo}</p>

                    <Button
                        className="bg-transparent p-2 lg:hidden"
                        iconAfter={true}
                        onClick={closeSidebar}
                    >
                        <SidebarClose size={20}/>

                    </Button>
                </div>
                <ul className={cn("flex flex-col gap-2 mt-2 flex-1 overflow-y-auto h-[calc(100%-187px)]")}>
                    {sidebarNavItems.map(({path, link, icon: Icon,}) => {
                        return (
                            <li key={path}>
                                <NavLink
                                    to={location.pathname === path ? "#" : path}
                                    className={({isActive}) => cn(
                                        "w-full flex items-center justify-between gap-2 py-2 px-4 text-slate-600",
                                        "hover:bg-gray-200 transition-colors ease-in-out rounded-lg",
                                        isActive && "bg-gray-200 text-slate-800 font-medium"
                                    )}
                                    onClick={closeSidebar}
                                >
                                    {link} {Icon && <Icon size={20}/>}
                                </NavLink>
                            </li>
                        )
                    })}
                </ul>
                <div className={"my-2"}>
                    <NavLink
                        to={location.pathname === "/users/create-user" ? "#" : "/users/create-user"}
                        className={({isActive}) => cn(
                            "w-full flex items-center justify-between gap-2 py-2 px-4 text-sm text-slate-600 ",
                            "hover:bg-gray-200 transition-colors ease-in-out rounded-lg [&_svg]:size-5 [&_svg]:shrink-0",
                            isActive && "bg-gray-200 text-slate-800 font-medium"
                        )}
                        onClick={closeSidebar}
                    >
                        Created new user <UserPlus/>
                    </NavLink>
                </div>
                <div
                    className="h-16 border-t-gray-300 border-t-1 p-2 flex items-center justify-center [&_svg]:size-5 [&_svg]:shrink-0 relative">
                    <UserAvatar userName={"Jane Doe"} onLogout={() => console.log("log-out")}/>
                </div>
            </aside>
            <div className="w-64 h-full hidden lg:block "/>
        </>
    )
}

export default Sidebar;