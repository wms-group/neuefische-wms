import {useState} from "react";
import {Controller, useFieldArray, useForm} from "react-hook-form";
import {Button, InputWithLabel, SelectWithLabel} from "@/components/ui";
import {ButtonType, CreateOrderDto, OrderDto, OrderStatus} from "@/types";
import {updateOrder} from "@/features/orders/api";

type OrderItemProps = {
    order: OrderDto;
    onUpdate: (order: OrderDto) => void;
    onDelete: (id: string) => void;
};

const OrderItem = ({ order, onUpdate, onDelete }: OrderItemProps) => {
    const [isEditing, setIsEditing] = useState(false);

    type FormValues = CreateOrderDto;

    const defaultValues: FormValues = {
        wares: order.wares.map((item) => ({
            productId: item.product.id,
            amount: item.amount,
        })),
        status: order.status,
    };

    const {
        control,
        handleSubmit,
        formState: { isSubmitting, isValid },
    } = useForm<FormValues>({
        defaultValues,
        mode: "onChange",
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "wares",
    });

    const onSubmit = async (data: FormValues) => {
        const updated = await updateOrder(order.id, data);
        onUpdate(updated);
        setIsEditing(false);
    };

    const handleDelete = () => onDelete(order.id);
    if (!isEditing) {
        return (
            <div className="card p-4 rounded shadow flex flex-col gap-2">
                <p>
                    Order: <strong>{order.id}#</strong>
                </p>
                <div>
                    <strong>Status:</strong> {order.status}
                </div>
                <div>
                    <strong>Items:</strong>
                    <ul className="max-h-30 overflow-y-auto pl-4 mt-2">
                        {order.wares.map((item, i) => {
                           return (
                                <li key={i}>
                                    {item.product.name} × {item.amount}
                                </li>
                            )
                        })}
                    </ul>
                </div>
                <div className="flex gap-2 mt-auto">
                    <Button onClick={() => setIsEditing(true)}>Edit</Button>
                    <Button onClick={handleDelete}>Delete</Button>
                </div>
            </div>
        );
    }
    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="card p-4 m-0 rounded shadow flex flex-col gap-4"
        >
            {fields.map((field, index) => (
                <div key={field.id} className="flex gap-4 items-end">
                    <Controller
                        name={`wares.${index}.productId`}
                        control={control}
                        rules={{ required: "Product ID is required" }}
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
                        name={`wares.${index}.amount`}
                        control={control}
                        rules={{
                            required: "Amount is required",
                            min: { value: 1, message: "Amount must be at least 1" },
                        }}
                        render={({ field, fieldState }) => (
                            <InputWithLabel
                                label="Amount"
                                type="number"
                                min={1}
                                placeholder="Amount"
                                error={fieldState.error?.message}
                                disabled={isSubmitting}
                                {...field}
                            />
                        )}
                    />
                    <Button
                        type={ButtonType.button}
                        className="text-red-600 font-bold text-xl leading-none px-2"
                        onClick={() => remove(index)}
                        disabled={isSubmitting}
                    >
                        &times;
                    </Button>
                </div>
            ))}

            <Button
                type={ButtonType.button}
                onClick={() => append({ productId: "", amount: 1 })}
                disabled={isSubmitting}
                className="self-start"
            >
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

            <div className="flex gap-2">
                <Button type={ButtonType.submit} disabled={!isValid || isSubmitting}>
                    {isSubmitting ? "Saving..." : "Save"}
                </Button>
                <Button
                    type={ButtonType.button}
                    onClick={() => setIsEditing(false)}
                    disabled={isSubmitting}
                >
                    Cancel
                </Button>
            </div>
        </form>
    );
};

export default OrderItem;
