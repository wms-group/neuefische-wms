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
            step,
            min,
            max,
            inputMode,
            pattern,
        },
        ref
    ) => {
        const decimalInputMode = inputMode || 'decimal';
        const decimalPattern = pattern || '[0-9]*[\\.,]?[0-9]{0,2}';
        const showNumericHints = type === "number" || inputMode || pattern;
        return (
            <Field className="flex flex-col flex-1 gap-1 rounded-lg">
                <Label htmlFor={name} className="text-sm font-medium text-gray-700">
                    {label}
                    {required && ' *'}
                </Label>
                <Input
                    id={name}
                    name={name}
                    type={type}
                    value={value ?? ""}
                    onChange={onChange}
                    onBlur={onBlur}
                    placeholder={placeholder}
                    required={required}
                    disabled={disabled}
                    ref={ref}
                    step={step}
                    min={min}
                    max={max}
                    inputMode={showNumericHints ? decimalInputMode : undefined}
                    pattern={showNumericHints ? decimalPattern : undefined}
                    className={cn(
                        "rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2",
                        error ? "border-red-500 focus:ring-red-500" : "border-secondary focus:ring-blue-500",
                        disabled && "bg-primary cursor-not-allowed",
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
