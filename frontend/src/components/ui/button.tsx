import {ButtonProps, ButtonType} from "@/types";
import {FC} from "react";
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
     ...rest
 }) => {
    const buttonContent = children ?? label
    return (
        <button
            className={cn(
                "flex justify-center items-center text-indigo-700 transition-all bg-indigo-100",
                "rounded-lg border border-transparent px-5 py-[0.6em] text-base [&_svg]:size-5 [&_svg]:shrink-0",
                "font-medium font-inherit cursor-pointer transition-colors duration-200 outline-none focus:outline focus:outline-auto ring-0",
                disabled && "text-neutral-400 bg-gray-200/50 hover:bg-gray-200/50 cursor-not-allowed",
                iconOnly && "w-fit h-fit rounded-full",
                className,
            )}
            type={type}
            onClick={onClick}
            disabled={disabled}
            {...rest}>
            {iconBefore}
            {buttonContent}
            {iconAfter}
        </button>
    )
}

export default Button;