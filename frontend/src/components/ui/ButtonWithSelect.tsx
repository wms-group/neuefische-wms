import {SearchableSelectProps} from "@/types";
import Button from "@/components/ui/button.tsx";
import SearchableSelect from "@/components/ui/SearchableSelect.tsx";
import {cn} from "@/utils";
import {PropsWithChildren} from "react";

type ButtonWithSelectProps = PropsWithChildren<SearchableSelectProps & {
    label?: string;
    selectClassName?: string;
    buttonClassName?: string;
    selectValue?: string
    onClick?: () => void;
}>;

const ButtonWithSelect: React.FC<ButtonWithSelectProps> = ({
    label,
    selectClassName,
    buttonClassName,
    selectValue,
    className,
    emptyLabel,
    onClick,
    onChange,
    children,
    ...props
                                                           }:ButtonWithSelectProps) => {

    return (
        <div className={cn("flex flex-row gap-0 m-0 p-0 flex-nowrap relative", className)}>
            <SearchableSelect
                className={cn("rounded-e-none h-auto", selectClassName)}
                classNames={{control: "pt-3 pb-1"}}
                emptyLabel={emptyLabel}
                onChange={onChange}
                value={selectValue}
                {...props} />
            {label && <small className={cn("absolute w-54 text-[0.65rem] text-black/30 px-2.5 text-nowrap")}>{label}</small>}
            <Button
                className={cn("rounded-s-none h-full", buttonClassName)}
                onClick={onClick}
                 >{children}</Button>
        </div>
    )
}

export default ButtonWithSelect;