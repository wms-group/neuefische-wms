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
     ...rest
 }) => {
    const buttonContent = children ?? label
    return (
        <UIButton
            className={cn(
                "flex justify-center items-center text-indigo-700 transition-all bg-indigo-100",
                "rounded-lg border border-transparent px-5 py-[0.6em] [&_svg]:size-5 [&_svg]:shrink-0",
                "font-medium font-inherit cursor-pointer transition-colors duration-200 outline-none focus:outline focus:outline-auto ring-0",
                disabled && "pointer-events-none text-neutral-400 cursor-not-allowed",
                iconOnly && "w-fit h-fit rounded-full p-0",
                className,
            )}
            type={type}
            onClick={onClick}
            disabled={disabled}
            {...rest}>
            {iconBefore}
            {buttonContent}
            {iconAfter}
        </UIButton>
    )
}

export default Button;