import {UserDto} from "@/types";
import {useEffect, useState} from "react";
import {getUsers} from "@/features/user/api";
import LayoutContainer from "@/components/shared/layout-container.tsx";
import UserAvatar from "@/features/user/components/user-avatar.tsx";
import {toast} from "sonner";

const Settings = () => {
    const [users, setUsers] = useState<UserDto[] | []>([]);

    useEffect(() => {
        (async () => {
            try {
                const data = await getUsers();
                setUsers(data);
            } catch (error) {
                if (error instanceof Error) {
                    toast.error(`Could not fetch users. Error: ${error.message}`);
                }
            }
        })();
    }, [])
    console.log(users)
    return (
        <LayoutContainer className={"h-full"}>
            {/*{users.length > 0 && (
                users.map(user => (
                    <p key={user.id}>{user.name}</p>
                ))
            )}*/}
            <LayoutContainer className={"bg-element-bg rounded-lg h-full p-4"}>
                <h1>Settings</h1>
                <div>
                    <UserAvatar nameOfUser={"Jane Doe"}/>
                </div>
            </LayoutContainer>

        </LayoutContainer>
    )
}

export default Settings;