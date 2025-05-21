import {ButtonType} from "@/types";
import {createStockItem} from "@/features/stock/api";
import {Button, InputWithLabel} from "@/components/ui";
import LayoutContainer from "@/components/shared/layout-container.tsx";
import {Controller, useForm} from "react-hook-form";

type FormValues = {
    productId: string;
    amount: number;
};

const CreateStockForm = () => {
    const {control, handleSubmit, formState: {isSubmitting}, reset} = useForm<FormValues>({
        defaultValues: {
            productId: "",
            amount: undefined,
        },
    })

    const onSubmit = async (data: FormValues) => {
        await createStockItem(data);
        reset();
    }
    return (
        <LayoutContainer>
            <h3>Create Stock Item</h3>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col justify-center gap-4"
            >
                <div className={"flex flex-col sm:flex-row gap-2"}>
                    <Controller
                        name={"productId"}
                        control={control}
                        rules={{
                            required: "Product ID is required"
                        }}
                        render={({field, fieldState}) => (
                            <InputWithLabel
                                label={"Product id:"}
                                placeholder={"Product Id"}
                                error={fieldState.error?.message}
                                {...field}
                            />
                        )}

                    />

                    <Controller
                        name={"amount"}
                        control={control}
                        rules={{
                            required: "Amount ID is required!"
                        }}
                        render={({field, fieldState}) => (
                            <InputWithLabel
                                type="number"
                                label={"Amount:"}
                                placeholder={"123456"}
                                inputMode={"decimal"}
                                error={fieldState.error?.message}
                                {...field}
                            />
                        )}
                    />
                </div>

                <Button
                    type={ButtonType.submit}
                    disabled={isSubmitting}
                    className="self-start"
                >{isSubmitting ? "Adding to Stock" : "Add Stock"}</Button>
            </form>
        </LayoutContainer>
    );
};

export default CreateStockForm;
