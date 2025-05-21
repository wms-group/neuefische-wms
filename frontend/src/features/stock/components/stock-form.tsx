import {FC} from "react";
import {Controller, useForm} from "react-hook-form";
import {Field, Label, Select} from "@headlessui/react";
import {Button, InputWithLabel} from "@/components/ui";
import {cn} from "@/utils";
import {ButtonType, FormValues, StockFormProps} from "@/types";

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
                            <Select
                                name={field.name}
                                value={field.value}
                                onChange={field.onChange}
                                className={cn(
                                    "h-[42px] px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2",
                                    errors.productId
                                        ? "border-red-500 focus:ring-red-500"
                                        : "border-secondary focus:ring-blue-500"
                                )}
                                aria-invalid={!!errors.productId}
                            >
                                <option value="" disabled>
                                    — select a product —
                                </option>
                                {products.map((p) => (
                                    <option key={p.id} value={p.id}>
                                        {p.name}
                                    </option>
                                ))}
                            </Select>
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
