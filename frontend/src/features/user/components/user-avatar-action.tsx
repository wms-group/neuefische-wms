import {useState} from 'react';
import {NavLink} from 'react-router-dom';
import {UserAvatarProps} from "@/types";
import {Button} from "@/components/ui";
import {LogOut, SettingsIcon} from "lucide-react";
import {cn} from "@/utils";
import UserAvatar from "@/features/user/components/user-avatar.tsx";

const UserAvatarAction = ({userName = 'Jane Doe', onLogout, btnClassName}: UserAvatarProps) => {
    const [open, setOpen] = useState<boolean>(false);

    return (
        <>
            <Button
                onClick={() => setOpen(!open)}
                className={cn(
                    "flex justify-center items-center relative text-left bg-transparent border-0 focus-visible:border-0 w-full",
                    btnClassName
                )
                }>
                <UserAvatar nameOfUser={userName} />
            </Button>
            {open && (
                <div className={cn(
                    "absolute -top-32 left-1/2 -translate-x-1/2 w-60 lg:w-52 rounded-xl shadow-lg z-30 p-4",
                    "bg-element-bg border border-secondary transition-all duration-300 ease-in-out"
                )}>
                    <NavLink
                        to="/users/settings"
                        className={({isActive}) => cn(
                            "block px-5 py-2 text-base text-slate-600 hover:bg-primary rounded-lg transition-colors group",
                            isActive && "bg-primary text-slate-800 font-medium link-item"
                        )}
                        onClick={() => setOpen(false)}
                    >
                        <span className={"flex justify-between items-center w-full"}>
                            Settings <SettingsIcon className="group-[.link-item]:text-indigo-500"/>
                        </span>
                    </NavLink>
                    <Button
                        onClick={() => {
                            setOpen(false);
                            /*double check if onLogout is really a function*/
                            if (typeof onLogout === 'function') {
                                onLogout();
                            }
                        }}
                        className="w-full justify-between gap-2 text-sm text-red-600 bg-transparent hover:bg-red-100 rounded-lg"
                    >
                        Logout <LogOut/>
                    </Button>
                </div>
            )}
        </>
    );
};

export default UserAvatarAction;
