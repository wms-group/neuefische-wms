import {useState} from 'react';
import {NavLink} from 'react-router-dom';
import {UserAvatarProps} from "@/types";
import {Button} from "@/components/ui";
import {LogOut, UserRoundIcon} from "lucide-react";
import {cn} from "@/utils";

const UserAvatar = ({userName = 'Max Mustermann', onLogout, btnClassName}: UserAvatarProps) => {
    const [open, setOpen] = useState(false);

    const initials = userName
        .split(' ')
        .map(name => name[0])
        .join('')
        .toUpperCase();

    return (
        <>
            <Button
                onClick={() => setOpen(!open)}
                className={cn(
                    "relative inline-block text-left bg-transparent border-0 focus-visible:border-0 w-full",
                    btnClassName
                )
                }>
                <div className="flex items-center justify-center gap-4">
                    <div
                        className="w-10 h-10 bg-slate-500 text-white font-medium flex
                        items-center justify-center rounded-full cursor-pointer select-none"
                    >
                        {initials}
                    </div>
                    <p className="text-sm font-medium text-gray-600">{userName}</p>
                </div>
            </Button>
            {open && (
                <div className={cn(
                    "absolute -top-32 left-1/2 -translate-x-1/2 w-60 lg:w-52 rounded-xl shadow-lg z-30 p-4",
                    "bg-element-bg border border-secondary transition-all duration-300 ease-in-out"
                )}>
                    <NavLink
                        to="/users/user-profile"
                        className={({isActive}) => cn(
                            "block px-5 py-2 text-base text-slate-600 hover:bg-primary rounded-lg transition-colors group",
                            isActive && "bg-primary text-slate-800 font-medium link-item"
                        )}
                        onClick={() => setOpen(false)}
                    >
                        <span className={"flex justify-between items-center w-full"}>
                            Profile <UserRoundIcon className="group-[.link-item]:text-indigo-500"/>
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

export default UserAvatar;
