import {useState} from "react";
import {Controller, useFieldArray, useForm} from "react-hook-form";
import {Button, InputWithLabel, SearchableSelect, SelectWithLabel} from "@/components/ui";
import {ButtonType, CreateOrderDto, OrderDto, OrderStatus, ProductOutputDTO} from "@/types";
import {updateOrder} from "@/features/orders/api";
import {Field, Label} from "@headlessui/react";
import {useCategoriesContext} from "@/context/CategoriesContext.ts";
import {selectProductsInCategoriesFromCategoryOutputDTOs} from "@/utils";
import {StatusBadge} from "@/components/ui/status-badge.tsx";
import {X} from "lucide-react";

type OrderItemProps = {
    order: OrderDto;
    onUpdate: (order: OrderDto) => void;
    onDelete: (id: string) => void;
    products: ProductOutputDTO[];
};

type FormValues = CreateOrderDto;

const OrderItem = ({order, onUpdate, onDelete, products}: OrderItemProps) => {
    const [isEditing, setIsEditing] = useState(false);
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
        formState: {isSubmitting, isValid},
        reset,
    } = useForm<FormValues>({
        defaultValues,
        mode: "onChange",
    });

    const {fields, append, remove} = useFieldArray({
        control,
        name: "wares",
    });

    const categories = useCategoriesContext().categories

    const onSubmit = async (data: FormValues) => {
        const updated = await updateOrder(order.id, data);
        onUpdate(updated);
        setIsEditing(false);
        reset();
    };
    const handleDelete = () => onDelete(order.id);

    if (!isEditing) {
        return (
            <div className="card p-4 rounded shadow flex flex-col gap-2">
                <div className="flex gap-1 justify-between items-center">
                    <p className="text-sm text-muted-foreground">
                        Order: <strong>{order.id}#</strong>
                    </p>
                    <StatusBadge status={order.status}/>
                </div>

                <div className="overflow-hidden w-full">
                    <table className="min-w-full text-sm">
                        <thead className="bg-white">
                        <tr>
                            <th className="px-2 py-1 text-left">Product</th>
                            <th className="px-2 py-1 text-right">Amount</th>
                        </tr>
                        </thead>
                    </table>
                    <div className="max-h-32 overflow-y-auto">
                        <table className="min-w-full text-sm">
                            <tbody className="max-h-32 overflow-y-auto">
                            {order.wares.map((item, i) => (
                                <tr key={i} className="even:bg-indigo-100/60 rounded">
                                    <td className="px-2 py-1">{item.product.name}</td>
                                    <td className="px-2 py-1 text-right">{item.amount}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="flex gap-2 mt-4 justify-between">
                    <Button onClick={() => setIsEditing(true)}>Edit</Button>
                    <Button variant="destructive" onClick={handleDelete}>Delete</Button>
                </div>
            </div>
        );
    }
    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="card p-4 m-0 rounded shadow flex flex-col gap-2"
        >
            {fields.map((field, index) => (
                <div key={field.id} className="flex gap-4 items-end">
                    <Controller
                        name={`wares.${index}.productId`}
                        control={control}
                        rules={{required: "Bitte ein Produkt wählen"}}
                        render={({field, fieldState}) => (
                            <Field className="flex flex-col flex-1 gap-1">
                                <Label className="text-sm font-medium">Produkt</Label>
                                <SearchableSelect
                                    name={field.name}
                                    value={field.value}
                                    options={selectProductsInCategoriesFromCategoryOutputDTOs(categories, products)}
                                    onChange={(option) => field.onChange(option?.value)}
                                    mandatory={true}
                                    emptyLabel={"Bitte ein Produkt wählen"}
                                />
                                {fieldState.error?.message && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {fieldState.error.message}
                                    </p>
                                )}
                            </Field>
                        )}
                    />

                    <Controller
                        name={`wares.${index}.amount`}
                        control={control}
                        rules={{
                            required: "Amount is required",
                            min: {value: 1, message: "Amount must be at least 1"},
                        }}
                        render={({field, fieldState}) => (
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
                    <div className="flex items-center justify-center h-full pt-6">
                        <Button
                            type={ButtonType.button}
                            variant="destructive"
                            iconOnly
                            className="bg-transparent"
                            onClick={() => remove(index)}
                            disabled={isSubmitting}
                        >
                            <X/>
                        </Button>
                    </div>
                </div>
            ))}

            <Button
                type={ButtonType.button}
                onClick={() => append({productId: "", amount: 1})}
                disabled={isSubmitting}
                className="self-start"
            >
                + Add Product
            </Button>

            <Controller
                name="status"
                control={control}
                render={({field}) => (
                    <SelectWithLabel
                        label="Order Status"
                        options={Object.values(OrderStatus)}
                        value={field.value}
                        onChange={field.onChange}
                        disabled={isSubmitting}
                    />
                )}
            />

            <div className="flex justify-between gap-2">
                <Button
                    type={ButtonType.submit}
                    disabled={!isValid || isSubmitting}>
                    {isSubmitting ? "Saving..." : "Save"}
                </Button>
                <Button
                    type={ButtonType.button}
                    variant="destructive"
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
