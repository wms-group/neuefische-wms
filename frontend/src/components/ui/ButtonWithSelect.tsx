import {ButtonProps, SearchableSelectProps} from "@/types";
import Button from "@/components/ui/button.tsx";
import SearchableSelect from "@/components/ui/SearchableSelect.tsx";
import {cn} from "@/utils";

type ButtonWithSelectProps = ButtonProps & SearchableSelectProps & {
    label?: string;
    selectClassName?: string;
    selectValue?: string
};

const ButtonWithSelect: React.FC<ButtonWithSelectProps> = ({
    label,
    selectClassName,
    selectValue,
    className,
    emptyLabel,
    onClick,
    onChange,
    ...props
                                                           }:ButtonWithSelectProps) => {

    return (
        <div className={ "flex flex-row gap-0 m-0 p-0 flex-nowrap relative"}>
            <SearchableSelect
                className={cn("rounded-e-none py-2.5 h-full grow basis-full min-w-54", selectClassName)}
                emptyLabel={emptyLabel}
                onChange={onChange}
                value={selectValue}
                {...props} />
            {label && <small className={cn("absolute w-54 text-[0.65rem] text-black/30 px-2.5 text-nowrap")}>{label}</small>}
            <Button
                className={cn("rounded-s-none shrink", className)}
                onClick={onClick}
                {...props} />
        </div>
    )
}

export default ButtonWithSelect;