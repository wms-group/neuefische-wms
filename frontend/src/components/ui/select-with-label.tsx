import {Description, Field, Label, Select} from "@headlessui/react";
import {ChevronDownIcon} from "lucide-react";
import {cn} from "@/utils";
import {SelectProps} from "@/types";

const SelectWithLabel = <T extends string | number>({
   label,
   description,
   options,
   value,
   onChange,
   disabled = false,
   className,
}: SelectProps<T>) => {
    return (
        <Field>
            <Label className="text-sm/6 font-medium">{label}</Label>
            {description && (
                <Description className="text-sm/6">{description}</Description>
            )}
            <div className="relative">
                <Select
                    value={value}
                    onChange={(event) => onChange(event.currentTarget.value as T)}
                    disabled={disabled}
                    className={cn(
                        "border-primary border-1 mt-3 block w-full appearance-none rounded-lg  bg-white/5 px-3 py-1.5 text-sm/6",
                        "focus:not-focus:outline-none focus:outline-2 focus:-outline-offset-2 focus:outline-white/25",
                        "*:text-black",
                        className
                    )}
                >
                    {options.map((option) => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                </Select>
                <ChevronDownIcon
                    className="pointer-events-none absolute top-2.5 right-2.5 size-4 fill-white/60"
                    aria-hidden="true"
                />
            </div>
        </Field>
    );
}

export default SelectWithLabel;
