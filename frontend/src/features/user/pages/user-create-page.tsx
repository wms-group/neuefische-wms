import CreateUserForm from "@/features/user/components/create-user-form.tsx";

const UserCreatePage = () => {
    return (
        <div className="max-w-lg mx-auto p-4">
            <h1 className="text-xl font-bold mb-4">Create new user</h1>
            <CreateUserForm />
        </div>
    );
};
export default UserCreatePage;
