import {cn} from "@/utils";

type userAvatarProps = {
    nameOfUser: string;
    className?: string;
}

const UserAvatar = ({nameOfUser, className} : userAvatarProps) => {

    const initials = nameOfUser
        .split(' ')
        .map(name => name[0])
        .join('')
        .toUpperCase();

    return (
        <div className={cn("flex items-center gap-4", className)}>
            <div
                className="w-10 h-10 bg-slate-500 text-white font-medium flex
                        items-center justify-center rounded-full cursor-pointer select-none"
            >
                {initials}
            </div>
            <p className="text-sm font-medium text-gray-600">{nameOfUser}</p>
        </div>
    )
}

export default UserAvatar;