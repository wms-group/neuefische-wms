import {Description, Field, Input, Label} from '@headlessui/react'
import {cn} from '@/utils'
import {InputWithLabelProps} from "@/types";

import {forwardRef} from "react";

const InputWithLabel = forwardRef<HTMLInputElement, InputWithLabelProps>(
    (
        {
            label,
            name,
            value,
            onChange,
            onBlur,
            type = "text",
            placeholder,
            required,
            className,
            error,
            disabled = false,
        },
        ref
    ) => {
        return (
            <Field className="flex flex-col gap-1">
                <Label htmlFor={name} className="text-sm font-medium text-gray-700">
                    {label}
                </Label>
                <Input
                    id={name}
                    name={name}
                    type={type}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    placeholder={placeholder}
                    required={required}
                    disabled={disabled}
                    ref={ref}
                    className={cn(
                        "rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2",
                        error ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500",
                        disabled && "bg-gray-200 cursor-not-allowed",
                        className
                    )}
                />
                {error && (
                    <Description className="text-sm text-red-600" role="alert">
                        {error}
                    </Description>
                )}
            </Field>
        );
    }
);

export default InputWithLabel;
