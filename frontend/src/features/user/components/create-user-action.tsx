import {NavLink} from "react-router-dom";
import {cn} from "@/utils";
import {UserPlus} from "lucide-react";
import {useSidebar} from "@/context/sidebar/useSidebar.ts";
import {Dispatch, SetStateAction} from "react";

export const CreateUserAction = ({
                                     className, setOpenCallBack
} : {
    setOpenCallBack?: Dispatch<SetStateAction<boolean>>; className?: string
}) => {
    const {closeSidebar} = useSidebar();
    return (
        <div className={cn("my-2", className)}>
            <NavLink
                to={"/users/create-user"}
                className={({isActive}) => cn(
                    "w-full flex items-center justify-between gap-2 py-2 px-4 text-slate-600 h-12",
                    "bg-primary/65 transition-colors ease-in-out rounded-lg [&_svg]:size-5 [&_svg]:shrink-0",
                    "hover:bg-indigo-400 hover:text-white hover:font-medium",
                    isActive && "bg-indigo-400 text-white font-medium hover:bg-indigo-400"
                )}
                onClick={() => {
                    closeSidebar();
                    if(setOpenCallBack) {
                        setOpenCallBack(false);
                    }
                }}
            >
                Create new user <UserPlus/>
            </NavLink>
        </div>
    )
}