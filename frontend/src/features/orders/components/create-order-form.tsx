import {Controller, useFieldArray, useForm} from "react-hook-form";
import {Button, InputWithLabel, SearchableSelect, SelectWithLabel} from "@/components/ui";
import {ButtonType, CreateOrderDto, OrderDto, OrderStatus, ProductOutputDTO} from "@/types";
import {createOrder} from "../api";
import {X} from "lucide-react";
import {cn, selectProductsInCategoriesFromCategoryOutputDTOs} from "@/utils";
import {Field, Label} from "@headlessui/react";
import {useCategoriesContext} from "@/context/CategoriesContext.ts";

type OrderFormProps = {
    onCreate: (order: OrderDto) => void;
    className?: string;
    products: ProductOutputDTO[];
};

const OrderForm = ({ onCreate, className, products }: OrderFormProps) => {
    const {
        control,
        handleSubmit,
        reset,
        formState: { isSubmitting, isValid },
    } = useForm<CreateOrderDto>({
        defaultValues: {
            wares: [{ productId: "", amount: 1 }],
            status: OrderStatus.PENDING,
        },
        mode: "onChange",
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "wares",
    });

    const categories = useCategoriesContext().categories

    const onSubmit = async (data: CreateOrderDto) => {
        const newOrder = await createOrder(data);
        onCreate(newOrder);
        reset();
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className={cn("flex flex-col gap-4 p-4 bg-element-bg rounded shadow max-", className)}
        >
            {fields.map((field, idx) => (
                <div key={field.id} className="flex gap-4 justify-center items-center">
                    <Controller
                        name={`wares.${idx}.productId`}
                        control={control}
                        rules={{ required: "Bitte ein Produkt wählen" }}
                        render={({ field, fieldState }) => (
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
                    <Button
                        onClick={() => remove(idx)}
                        disabled={isSubmitting}
                        iconOnly
                        className={"bg-transparent mt-6"}
                        variant="destructive"
                    >
                        <X />
                    </Button>
                </div>
            ))}

            <Button
                type={ButtonType.button}
                onClick={() => append({ productId: "", amount: 1 })}
                disabled={isSubmitting}
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

            <Button type={ButtonType.submit} disabled={!isValid || isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Order"}
            </Button>
        </form>
    );
};

export default OrderForm;
