import {FormEvent, useState} from "react";
import {ButtonType, Role} from "@/types";
import Button from "@/components/ui/button.tsx";
import {createUser} from "@/features/user/api";

const UserCreatePage = () => {
    const [username, setUsername] = useState("");
    const [role, setRole] = useState<Role>(Role.CLERK);
    const [name, setName] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await createUser({ username, name, role, password });
            setUsername("");
            setName("");
            setPassword("");
            setRole(Role.CLERK);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto p-4">
            <h1 className="text-xl font-bold mb-4">Create new user</h1>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4 opacity-100 transition-opacity duration-200" style={{ opacity: loading ? 0.5 : 1 }}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="border p-2 rounded"
                    required
                    disabled={loading}
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border p-2 rounded"
                    required
                    disabled={loading}
                />

                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="border p-2 rounded"
                    required
                    disabled={loading}
                />

                <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as Role)}
                    className="border p-2 rounded"
                    disabled={loading}
                >
                    {Object.values(Role).map((role) => (
                        <option key={role} value={role}>{role}</option>
                    ))}
                </select>

                <Button type={ButtonType.submit} disabled={loading}>
                    {loading ? "Creating..." : "Create User"}
                </Button>
            </form>
        </div>
    );
};

export default UserCreatePage;
