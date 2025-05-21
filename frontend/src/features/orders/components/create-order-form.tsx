import {Controller, useFieldArray, useForm} from "react-hook-form";
import {Button, InputWithLabel, SelectWithLabel} from "@/components/ui";
import {ButtonType, CreateOrderDto, OrderDto, OrderStatus} from "@/types";
import {createOrder} from "../api";

type FormValues = CreateOrderDto;

const OrderForm = ({ onCreated }: { onCreated?: (order: OrderDto) => void }) => {
    const { control, handleSubmit, formState: { isSubmitting, isValid }, reset } = useForm<FormValues>({
        defaultValues: {
            wares: [{ productId: "", amount: 1 }],
            status: OrderStatus.PENDING,
        },
        mode: "onChange",
    });

    const { fields, append, remove } = useFieldArray({ control, name: "wares" });

    const onSubmit = async (data: FormValues) => {
        const created = await createOrder(data);
        onCreated?.(created);
        reset();
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 p-4 bg-white rounded shadow">
            {/* ... wie gehabt, nur: statt productId/product */}
            {fields.map((field, idx) => (
                <div key={field.id} className="flex gap-4 items-end">
                    <Controller
                        name={`wares.${idx}.productId`}
                        control={control}
                        rules={{ required: "Product ID required" }}
                        render={({ field, fieldState }) => (
                            <InputWithLabel
                                label="Product ID"
                                placeholder="Product ID"
                                error={fieldState.error?.message}
                                disabled={isSubmitting}
                                {...field}
                            />
                        )}
                    />
                    <Controller
                        name={`wares.${idx}.amount`}
                        control={control}
                        rules={{ min: { value: 1, message: "At least 1" } }}
                        render={({ field, fieldState }) => (
                            <InputWithLabel
                                label="Amount"
                                type="number"
                                min={1}
                                error={fieldState.error?.message}
                                disabled={isSubmitting}
                                {...field}
                            />
                        )}
                    />
                    <button type="button" onClick={() => remove(idx)} disabled={isSubmitting} className="text-red-600">
                        &times;
                    </button>
                </div>
            ))}

            <Button type={ButtonType.button} onClick={() => append({ productId: "", amount: 1 })} disabled={isSubmitting}>
                + Add Product
            </Button>

            <Controller
                name="status"
                control={control}
                render={({ field }) => (
                    <SelectWithLabel
                        label="Order Status"
                        options={Object.values(OrderStatus)}
                        value={field.value}
                        onChange={field.onChange}
                        disabled={isSubmitting}
                    />
                )}
            />

            <Button type={ButtonType.submit} disabled={!isValid || isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Order"}
            </Button>
        </form>
    );
};

export default OrderForm;
