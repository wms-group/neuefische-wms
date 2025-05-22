import {FC} from "react";
import {Controller, useForm} from "react-hook-form";
import {Field, Label} from "@headlessui/react";
import {Button, InputWithLabel, SearchableSelect} from "@/components/ui";
import {cn, selectProductsInCategoriesFromCategoryOutputDTOs} from "@/utils";
import {ButtonType, FormValues, StockFormProps} from "@/types";
import {useCategoriesContext} from "@/context/CategoriesContext.ts";

export const StockForm: FC<StockFormProps> = ({
  products,
  onSubmit,
  submitLabel,
  submitClassName,
  iconAfter,
  disabled,
  defaultValues,
}) => {
    const {
        control,
        handleSubmit,
        formState: { isSubmitting, errors },
        reset,
    } = useForm<FormValues>({
        defaultValues: {
            productId: defaultValues?.productId ?? products[0]?.id ?? "",
            amount: defaultValues?.amount ?? undefined,
        },
    });

    const categories = useCategoriesContext().categories

    const internalSubmit = async (data: FormValues) => {
        await onSubmit(data);
        reset();
    };

    return (
        <form onSubmit={handleSubmit(internalSubmit)} className="flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {/* PRODUCT SELECT */}
                <Controller
                    name="productId"
                    control={control}
                    rules={{ required: "Bitte ein Produkt wählen" }}
                    render={({ field }) => (
                        <Field className="flex flex-col flex-1 gap-1">
                            <Label className="text-sm font-medium">Produkt</Label>
                            <SearchableSelect
                                name={field.name}
                                value={field.value}
                                options={selectProductsInCategoriesFromCategoryOutputDTOs(categories, products)}
                                onChange={(option) => field.onChange(option?.value)}
                                mandatory={true}
                                emptyLabel={"Bitte ein Produkt wählen"}
                                className={cn(
                                    errors.productId && "border-red-500 ring-red-500"
                                )}
                                aria-invalid={!!errors.productId}
                            />
                            {errors.productId && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.productId.message}
                                </p>
                            )}
                        </Field>
                    )}
                />

                {/* AMOUNT INPUT */}
                <Controller
                    name="amount"
                    control={control}
                    rules={{ required: "Menge ist erforderlich" }}
                    render={({ field, fieldState }) => (
                        <InputWithLabel
                            {...field}
                            type="number"
                            label="Menge"
                            placeholder="0"
                            inputMode="decimal"
                            error={fieldState.error?.message}
                        />
                    )}
                />
            </div>

            <Button
                type={ButtonType.submit}
                disabled={disabled ?? isSubmitting}
                iconAfter={iconAfter}
                className={cn("self-start", submitClassName)}
            >
                {isSubmitting ? `${submitLabel}…` : submitLabel}
            </Button>
        </form>
    );
};
