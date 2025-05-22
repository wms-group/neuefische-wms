import {Control, Controller} from "react-hook-form";
import {CategoryOutputDTO, CreateOrderDto, ProductOutputDTO} from "@/types";
import {Field, Label} from "@headlessui/react";
import {SearchableSelect} from "@/components/ui";
import {selectProductsInCategoriesFromCategoryOutputDTOs} from "@/utils";

type ControlledProductSelectProps = {
    control: Control<CreateOrderDto>;
    name: "wares" | "status" | `wares.${number}` | `wares.${number}.productId` | `wares.${number}.amount`;
    categories: CategoryOutputDTO[];
    products: ProductOutputDTO[];
    required?: boolean;
    label?: string;
};

const ControlledProductSelect = ({
     control,
     name,
     categories,
     products,
     required = true,
     label = "Produkt",
 }: ControlledProductSelectProps) => (
    <Controller
        name={name}
        control={control}
        rules={required ? { required: "Bitte ein Produkt wählen" } : {}}
        render={({ field, fieldState }) => (
            <Field className="flex flex-col flex-1 gap-1">
                <Label className="text-sm font-medium">{label}</Label>
                <SearchableSelect
                    name={field.name}
                    value={field.value as string | undefined}
                    options={selectProductsInCategoriesFromCategoryOutputDTOs(categories, products)}
                    onChange={(option) => field.onChange(option?.value)}
                    mandatory={required}
                    emptyLabel="Bitte ein Produkt wählen"
                />
                {fieldState.error?.message && (
                    <p className="mt-1 text-sm text-red-600">
                        {fieldState.error.message}
                    </p>
                )}
            </Field>
        )}
    />
);

export default ControlledProductSelect;
