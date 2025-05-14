import {useState} from 'react';
import {Link} from 'react-router-dom';
import {UserAvatarProps} from "@/types";
import Button from "@/components/ui/button.tsx";
import {LogOut, UserRoundIcon} from "lucide-react";
import {cn} from "@/utils";

const UserAvatar = ({userName = 'Max Mustermann', onLogout}: UserAvatarProps) => {
    const [open, setOpen] = useState(false);

    const initials = userName
        .split(' ')
        .map(name => name[0])
        .join('')
        .toUpperCase();

    return (
        <div className="relative w-full">
            <Button
                onClick={() => setOpen(!open)}
                className="relative inline-block text-left bg-transparent border-0 focus-visible:border-0">
                <div className="flex items-center justify-center gap-4">
                    <div
                        className="w-10 h-10 bg-blue-600 text-white flex items-center justify-center rounded-full cursor-pointer select-none"
                        onMouseEnter={() => document.body.style.cursor = 'pointer'}
                        onMouseLeave={() => document.body.style.cursor = 'default'}
                    >
                        {initials}
                    </div>
                    <p className="text-sm text-gray-600">{userName}</p>
                </div>
            </Button>
            {open && (
                <div className={cn(
                    "absolute -top-32 -right-4 mt-2 w-60 rounded-xl shadow-lg z-30 p-2 bg-gray-100 border border-gray-300 transition-all duration-300 ease-in-out"
                )}>
                    <Link
                        to="/user-profile"
                        className="block px-5 py-2 text-base text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
                        onClick={() => setOpen(false)}
                    >
                        <span className={"flex justify-between items-center w-full"}>Profile <UserRoundIcon/></span>
                    </Link>
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
        </div>
    );
};

export default UserAvatar;
