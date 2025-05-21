import {Controller, useForm} from "react-hook-form";
import {Button, InputWithLabel, SelectWithLabel} from "@/components/ui";
import {ButtonType, UserRole} from "@/types";
import {createUser} from "@/features/user/api";

type FormValues = {
    username: string;
    password: string;
    name: string;
    role: UserRole;
};

const CreateUserForm = () => {

    const {
        control,
        handleSubmit,
        formState: { isSubmitting, isValid },
        reset,
    } = useForm<FormValues>({
        defaultValues: {
            username: "",
            password: "",
            name: "",
            role: UserRole.CLERK,
        },
    });

    const onSubmit = async (data: FormValues) => {
        await createUser(data);
        reset();
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <Controller
                name="username"
                control={control}
                rules={{
                    required: "Username is required",
                    minLength: { value: 3, message: "Username must be at least 3 characters" },
                }}
                render={({ field, fieldState }) => (
                    <InputWithLabel
                        label="Username"
                        placeholder="Username"
                        error={fieldState.error?.message}
                        disabled={isSubmitting}
                        {...field}
                    />
                )}
            />

            <Controller
                name="password"
                control={control}
                rules={{ required: "Password is required" }}
                render={({ field, fieldState }) => (
                    <InputWithLabel
                        type="password"
                        label="Password"
                        placeholder="Password"
                        error={fieldState.error?.message}
                        disabled={isSubmitting}
                        {...field}
                    />
                )}
            />

            <Controller
                name="name"
                control={control}
                rules={{
                    required: "Name is required",
                    minLength: { value: 3, message: "Name must be at least 3 characters" },
                }}
                render={({ field, fieldState }) => (
                    <InputWithLabel
                        label="Name"
                        placeholder="Name"
                        error={fieldState.error?.message}
                        disabled={isSubmitting}
                        {...field}
                    />
                )}
            />

            <Controller
                name="role"
                control={control}
                render={({ field }) => (
                    <SelectWithLabel
                        label="Role"
                        options={Object.values(UserRole)}
                        value={field.value}
                        onChange={field.onChange}
                        disabled={isSubmitting}
                    />
                )}
            />

            <Button type={ButtonType.submit} disabled={!isValid || isSubmitting}>
                {isSubmitting ? "Creating..." : "Create User"}
            </Button>
        </form>
    )
}

export default CreateUserForm;