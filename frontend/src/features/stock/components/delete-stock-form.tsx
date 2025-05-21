import {ButtonType} from "@/types";
import {deleteStockItem} from "@/features/stock/api";
import {Button, InputWithLabel} from "@/components/ui";
import LayoutContainer from "@/components/shared/layout-container.tsx";
import {Controller, useForm} from "react-hook-form";
import {DeleteIcon} from "lucide-react";

type FormValues = {
    productId: string;
    amount: number;
};

const DeleteStockForm = () => {
    const {control, handleSubmit, formState: {isSubmitting}, reset} = useForm<FormValues>({
        defaultValues: {
            productId: "",
            amount: undefined,
        },
    });

    const onSubmit = async (data: FormValues) => {
        await deleteStockItem(data);
        reset();
    };

    return (
        <LayoutContainer>
            <h3>Remove Stock Item</h3>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className={"flex flex-col justify-center gap-4"}
            >
                <div className={"flex flex-col sm:flex-row gap-2"}>
                    <Controller
                        name="productId"
                        control={control}
                        rules={{ required: "Product ID is required" }}
                        render={({ field, fieldState }) => (
                            <InputWithLabel
                                label="Product ID:"
                                placeholder="Product ID"
                                error={fieldState.error?.message}
                                {...field}
                            />
                        )}
                    />

                    <Controller
                        name="amount"
                        control={control}
                        rules={{ required: "Amount is required" }}
                        render={({ field, fieldState }) => (
                            <InputWithLabel
                                type="number"
                                label="Amount:"
                                placeholder="Amount"
                                inputMode="decimal"
                                error={fieldState.error?.message}
                                {...field}
                            />
                        )}
                    />
                </div>

                <Button
                    type={ButtonType.submit}
                    iconAfter={<DeleteIcon />}
                    disabled={isSubmitting}
                    className="self-start gap-2 bg-red-400 text-white hover:bg-red-500 te"
                >
                    {isSubmitting ? "Removing..." : "Remove Stock"}
                </Button>
            </form>
        </LayoutContainer>
    );
};

export default DeleteStockForm;
