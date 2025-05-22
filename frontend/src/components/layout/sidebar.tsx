import {SidebarComponentProps} from "@/types";
import {cn} from "@/utils";
import {NavLink} from "react-router-dom";
import {useSidebar} from "@/context/sidebar/useSidebar.ts";
import {SidebarClose} from "lucide-react";
import {Button} from "@/components/ui";

const Sidebar = ({sidebarItems}: SidebarComponentProps) => {
    const {isOpen, closeSidebar} = useSidebar()
    const {sidebarHeader, sidebarNavItems} = sidebarItems;
    return (
        <>
            {isOpen && <div
                className="absolute h-full w-full inset-0 z-98 bg-zinc-600/65 transition-opacity duration-350 ease-in-out lg:hidden">
                <Button className="w-full h-full bg-transparent" onClick={closeSidebar} />
            </div>}
            <aside className={cn(
                "sidebar fixed bg-element-bg border-x border-primary px-4 w-64 h-screen top-0 left-0 z-999 transition-transform duration-300 ease-in-out",
                isOpen ? "translate-x-0" : "-translate-x-full",
                "lg:translate-x-0"
            )}
                   style={{ left: "max((100vw - 1980px) / 2, 0px)" }}>
                <div className="h-16 border-b-secondary border-b-1 p-2 flex items-center relative justify-between">
                    <div className={"h-full w-full"}>
                        <img src={sidebarHeader.logoPath} alt="logo" className="h-14 w-auto mx-auto" />
                    </div>

                    <Button
                        className="bg-transparent p-2 lg:hidden"
                        iconAfter={true}
                        onClick={closeSidebar}
                    >
                        <SidebarClose size={20}/>

                    </Button>
                </div>
                <ul className={cn("flex flex-col mt-6 gap-2 overflow-y-auto h-[calc(100%-13.5rem)]")}>
                    {sidebarNavItems.map(({path, link, icon: Icon,}) => {
                        return (
                            <li key={path}>
                                <NavLink
                                    to={path}
                                    className={({isActive}) => cn(
                                        "w-full flex items-center justify-between gap-2 py-2 px-4 text-slate-600",
                                        "hover:bg-primary transition-colors ease-in-out rounded-lg group",
                                        isActive && "bg-primary text-slate-800 font-medium link-item"
                                    )}
                                    onClick={closeSidebar}
                                >
                                    {link} {Icon && <Icon className="group-[.link-item]:text-indigo-500" size={20}/>}
                                </NavLink>
                            </li>
                        )
                    })}
                </ul>
            </aside>
            <div className="w-64 h-full hidden lg:block "/>
        </>
    )
}

export default Sidebar;