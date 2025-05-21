import {UserDto, UserRole} from "@/types";
import {useEffect, useState} from "react";
import {deleteUser, getUsers} from "@/features/user/api";
import LayoutContainer from "@/components/shared/layout-container.tsx";
//import UserAvatar from "@/features/user/components/user-avatar.tsx";
import {toast} from "sonner";
import {Tab, TabGroup, TabList, TabPanel, TabPanels} from "@headlessui/react";
import GridLayout from "@/components/shared/grid-layout.tsx";
import UserCard from "@/features/user/components/user-card.tsx";

const roles: UserRole[] = Object.values(UserRole);

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

    const handleUpdate = (updatedUser: UserDto) => {
        setUsers((prev) =>
            prev.map((u) => (u.id === updatedUser.id ? updatedUser : u))
        );
    };

    const handleDelete = (id: string) => {
        deleteUser(id).then(() =>
            setUsers((prev) => prev.filter((u) => u.id !== id))
        );
    };

    return (
        <LayoutContainer className=" h-full p-4 rounded-lg">
            <TabGroup className="w-full h-full">
                <TabList className="flex gap-4 border-b border-gray-200 w-full">
                    {roles.map((role) => (
                        <Tab key={role} className="rounded-t-md px-4 py-2 text-sm font-medium bg-element-bg data-selected:bg-blue-100 data-selected:text-blue-600 data-hover:bg-gray-100 focus:outline-none"
                        >
                            {role}
                        </Tab>
                    ))}
                </TabList>

                <TabPanels className="mt-4 max-w-5xl">
                    {roles.map((role) => (
                        <TabPanel key={role}>
                            <GridLayout gridCols={{ base: 1, sm: 2, md: 2, xl: 3 }}>
                                {users
                                    .filter((u) => u.role === role)
                                    .map((user) => (
                                        <UserCard
                                            key={user.id}
                                            user={user}
                                            onUpdate={handleUpdate}
                                            onDelete={handleDelete}
                                        />
                                    ))}
                            </GridLayout>
                        </TabPanel>
                    ))}
                </TabPanels>
            </TabGroup>
        </LayoutContainer>
    );
};

export default Settings;