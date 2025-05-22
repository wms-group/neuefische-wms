import {Dispatch} from "react";
import {CategoryInputDTO, CategoryOutputDTO} from "@/types";
import {cn, selectGroupsFromCategoryOutputDTOs} from "@/utils";
import {InputWithLabel, SearchableSelect} from "@/components/ui";
import {useCategoriesContext} from "@/context/CategoriesContext.ts";
import {Controller, useForm} from "react-hook-form";
import {Field, Input, Label} from "@headlessui/react";

type CategoryFormProps = {
    onSubmit: (category: CategoryInputDTO) => Promise<unknown>;
    value?: CategoryOutputDTO;
    disabled?: boolean;
    defaultParentId?: string;
    className?: string;
    setFormRef?: Dispatch<React.SetStateAction<HTMLFormElement | null>>;
}

const CategoryForm = ({onSubmit, value, disabled, defaultParentId, className, setFormRef}: CategoryFormProps) => {
    const {
        control,
        handleSubmit,
        formState: { isSubmitting, errors },
        reset,
    } = useForm<CategoryInputDTO>({
        defaultValues: {
            name: value?.name ?? "",
            parentId: value?.parentId ?? defaultParentId ?? undefined,
        },
    });

    const categories = useCategoriesContext().categories;

    const handleInternalSubmit = async (category: CategoryInputDTO) => {
        const savedCategory = await onSubmit(category);
        reset();
        return savedCategory;
    }

    return (
        <form
            ref={setFormRef}
            className={cn("flex flex-col flex-wrap md:flex-row gap-6 justify-between items-start", className, (disabled || isSubmitting) && "opacity-50 cursor-not-allowed")}
            onSubmit={handleSubmit(handleInternalSubmit)}>
            <Controller
                name="name"
                control={control}
                rules={{ required: "Kategoriename ist erforderlich" }}
                render={({ field, fieldState }) => (
                    <InputWithLabel
                        label="Name"
                        fieldClassName="grow-1 basis-40"
                        error={fieldState.error?.message}
                        {...field}
                    />
                )}
            />

            <Controller
                name="parentId"
                control={control}
                render={({ field }) => (
                    <>{value ?
                        <Field className="flex flex-col flex-1 gap-1 grow-1 basis-40">
                        <Label>Kategorie</Label>
                        <SearchableSelect
                            {...field}
                            options={selectGroupsFromCategoryOutputDTOs(categories)}
                            onChange={(option) => field.onChange(option?.value)}
                            value={field.value}
                            defaultValue={defaultParentId}
                            className={cn(
                                errors.parentId && "border-red-500 ring-red-500"
                            )}
                            aria-invalid={!!errors.parentId}
                        />
                        {errors.parentId && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.parentId.message}
                            </p>
                        )}
                    </Field> :
                        <Input type="hidden" {...field} />}</>
                )}
            />

        </form>
    )
}

export default CategoryForm;