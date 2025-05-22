import {FC} from "react";
import {Button as UIButton} from "@headlessui/react";
import {ButtonProps, ButtonType} from "@/types";
import {cn} from "@/utils";

const Button: FC<ButtonProps> = ({
     className,
     onClick,
     children,
     type = ButtonType.button,
     label,
     disabled,
     iconBefore,
     iconAfter,
     iconOnly,
    variant = "default",
     ...rest
 }) => {
    const buttonContent = children ?? label;

    const baseClasses = "flex justify-center items-center transition-all font-medium font-inherit rounded-lg border border-transparent px-5 py-[0.6em] [&_svg]:size-5 [&_svg]:shrink-0 focus:outline focus:outline-auto ring-0";

    const variantClasses = {
        default: "bg-indigo-100 text-indigo-700 hover:bg-indigo-200",
        destructive: "bg-red-100 text-red-700 hover:bg-red-200",
        outline: "bg-transparent border text-indigo-700 hover:bg-indigo-50",
        ghost: "bg-transparent text-indigo-700 hover:bg-indigo-100",
    };

    return (
        <UIButton
            className={cn(
                baseClasses,
                variantClasses[variant],
                disabled && "pointer-events-none text-neutral-400 cursor-not-allowed",
                iconOnly && "w-fit h-fit rounded-full p-0",
                className
            )}
            type={type}
            onClick={onClick}
            disabled={disabled}
            {...rest}
        >
            {iconBefore}
            {buttonContent}
            {iconAfter}
        </UIButton>
    );
};

export default Button;