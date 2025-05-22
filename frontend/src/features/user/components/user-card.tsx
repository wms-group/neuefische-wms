import {useState} from 'react';
import {UserDto} from "@/types";
import {updateUser} from "@/features/user/api";
import {Button, InputWithLabel} from "@/components/ui";

const UserCard = ({user, onUpdate, onDelete}: {
    user: UserDto;
    onUpdate: (user: UserDto) => void;
    onDelete: (id: string) => void;
}) => {
    const [editUser, setEditUser] = useState<UserDto>(user);
    const [isEditing, setIsEditing] = useState<boolean>(false);

    const handleSave = async () => {
        const updated = await updateUser(editUser);
        onUpdate(updated);
        setIsEditing(false);
    };

    return (
        <div className="card rounded-2xl p-4 shadow-md bg-white flex flex-col h-full ">
            {isEditing ? (
                <>
                        <div className="mb-4">
                            <InputWithLabel
                                value={editUser.name}
                                onChange={(e) => setEditUser({...editUser, name: e.target.value})}
                                className="w-full border px-2 py-1 rounded"
                                label={'Given Name'}
                                name={'givenName'}
                            />
                            <InputWithLabel
                                value={editUser.username}
                                onChange={(e) => setEditUser({...editUser, username: e.target.value})}
                                className="w-full border px-2 py-1 rounded"
                                label={'Username'}
                                name={'username'}
                            />
                            <InputWithLabel
                                value={editUser.password}
                                onChange={(e) => setEditUser({...editUser, password: e.target.value})}
                                className="w-full border px-2 py-1 rounded"
                                type="password"
                                label={'Password'}
                                name={'password'}
                            />
                        </div>
                        <div className="flex justify-between mt-auto">
                            <Button onClick={handleSave}>Save</Button>
                            <Button onClick={() => setIsEditing(false)}>Cancel</Button>
                        </div>
                </>
            ) : (
                <>
                    <div className="mb-4">
                        <h3 className="font-bold">{user.name}</h3>
                        <p className="text-sm text-gray-600">@{user.username}</p>
                        <p className="text-xs font-mono text-gray-400">{user.role}</p>
                    </div>
                    <div className="flex justify-between mt-auto">
                        <Button onClick={() => setIsEditing(true)}>Edit</Button>
                        <Button variant="destructive" onClick={() => onDelete(user.id)}>Delete</Button>
                    </div>
                </>
            )}
        </div>
    );
};

export default UserCard;