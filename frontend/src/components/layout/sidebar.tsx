import {SidebarComponentProps} from "@/types";
import {cn} from "@/utils";
import {NavLink} from "react-router-dom";

const Sidebar = ({sidebarItems}: SidebarComponentProps) => {
    const {defaultOpen, logo, sidebarNavItems} = sidebarItems;
    return (
        <>
            <aside className={cn(
                "bg-gray-100 border-r-gray-300 border-r-1 p-4 pt-0 fixed h-screen flex flex-col",
                defaultOpen && "w-64",
            )}>
                <div className="h-16 border-b-gray-300 border-b-1 p-2 flex items-center">
                    <p className="text-xl font-bold text-center flex-1 overflow-x-auto">{logo}</p>
                </div>
                <ul className={cn("flex flex-col gap-2 mt-2 flex-1 overflow-y-auto")}>
                {sidebarNavItems.map(({path, link, icon: Icon,}) => {
                    return(
                    <li key={path}>
                        <NavLink
                            className="w-full flex items-center justify-between gap-2 px-2 py-1 hover:bg-gray-200"
                            to={path}>
                            {link}
                            {Icon && <Icon size={20}/>}
                        </NavLink>
                    </li>
                )})}
                </ul>
                <div className="h-10 border-t-gray-300 border-t-1 p-2">
                    <p>LOGOUT</p>
                </div>
            </aside>
            {/* PLACEHOLDER FOR SIDEBAR */}
            <div className={cn(defaultOpen && "ml-64")}/>
        </>
    )
}

export default Sidebar;