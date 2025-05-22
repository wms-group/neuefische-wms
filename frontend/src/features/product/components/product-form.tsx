import {cn, selectGroupsFromCategoryOutputDTOs} from "@/utils";
import {ProductInputDTO, ProductOutputDTO} from "@/types";
import {Dispatch, SetStateAction} from "react";
import {InputWithLabel, SearchableSelect} from "@/components/ui";
import {useCategoriesContext} from "@/context/CategoriesContext.ts";
import {Controller, useForm} from "react-hook-form";
import {Field, Label} from "@headlessui/react";

type ProductFormProps = {
    onSubmit: (product: ProductInputDTO) => Promise<unknown>;
    value?: ProductOutputDTO;
    disabled?: boolean;
    defaultCategoryId: string;
    className?: string;
    setFormRef: Dispatch<SetStateAction<HTMLFormElement | null>>
}

const ProductForm = ({onSubmit, value, disabled, defaultCategoryId, className, setFormRef}: ProductFormProps) => {
    const categories = useCategoriesContext().categories;

    const {
        control,
        handleSubmit,
        formState: { isSubmitting, errors },
        reset,
    } = useForm<ProductInputDTO>({
        defaultValues: {
            name: value?.name ?? "",
            categoryId: value?.categoryId ?? defaultCategoryId,
            price: value && parseFloat(value.price.replace(",", ".") ?? "0").toFixed(2),
        },
    });

    const handleInternalSubmit = async (product: ProductInputDTO) => {
        const savedProduct = await onSubmit(product);
        reset();
        return savedProduct;
    }

    return (
        <form
            ref={setFormRef}
            data-testid={cn(
                "product-form",
                value ? "edit" : "new"
            )}
            className={cn("flex gap-2 flex-wrap flex-row justify-stretch items-start", className, (disabled || isSubmitting) && "opacity-50 cursor-not-allowed")}
            onSubmit={handleSubmit(handleInternalSubmit)}>
            <Controller
                name="name"
                control={control}
                rules={{ required: "Produktname ist erforderlich" }}
                render={({ field, fieldState }) => (
                    <InputWithLabel
                        label="Name"
                        fieldClassName="w-full grow-1 sm:w-fit sm:grow basis-80"
                        error={fieldState.error?.message}
                        {...field}
                    />
                )}
            />

            <Controller
                name="price"
                control={control}
                rules={{ required: "Bitte einen Preis eingeben" }}
                render={({ field, fieldState }) => (
                    <InputWithLabel
                        {...field}
                        label="Preis"
                        value={field.value}
                        placeholder="0,00"
                        type="number"
                        inputMode="decimal"
                        fieldClassName="w-full w-fit grow sm:shrink-1 h-full basis-1"
                        error={fieldState.error?.message}
                    />
                )}
            />

            {value && <Controller
                name="categoryId"
                control={control}
                rules={{ required: "Bitte eine Kategorie wählen" }}
                render={({ field }) => (
                    <Field className="flex flex-col flex-1 gap-1">
                        <Label>Kategorie</Label>
                        <SearchableSelect
                            name="categoryId"
                            options={selectGroupsFromCategoryOutputDTOs(categories)}
                            onChange={(option) => field.onChange(option?.value)}
                            mandatory={true}
                            value={field.value}
                            defaultValue={defaultCategoryId}
                            className={cn(
                                errors.categoryId && "border-red-500 ring-red-500"
                            )}
                            aria-invalid={!!errors.categoryId}
                        />
                        {errors.categoryId && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.categoryId.message}
                            </p>
                        )}
                    </Field>
                )}
            />}
        </form>
    )
}

export default ProductForm;