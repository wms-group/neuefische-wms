import {SearchableSelectProps, SelectGroup, SelectOption} from "@/types";
import Select from "react-select";
import {FC} from "react";
import {cn} from "@/utils";

const SearchableSelect: FC<SearchableSelectProps> = (props) => {
    const optionsWithEmptyOption = props.options;
    const flatOptions = props.options.flatMap(o => 'value' in o ? o : (o as SelectGroup).options);
    const emptyOption: SelectOption = {
        label: props.emptyLabel ?? (props.mandatory ? "- Bitte treffen Sie eine Auswahl -" : "- Keine -"),
        value: ""
    }
    if (!props.mandatory && !flatOptions.find(o => (o.value ?? "") === "")) {
        optionsWithEmptyOption.unshift(emptyOption);
        flatOptions.unshift(emptyOption)
    }


    const optionForValue = (value: string | null): SelectOption => {
        return flatOptions.find(o => o.value === value) ?? emptyOption;
    }

    return (
        <Select
            name={props.name}
            unstyled={true}
            defaultValue={optionForValue(props.defaultValue ?? null)}
            classNames={{
                container: ({isFocused}) => cn('h-[42px] rounded-lg border border-secondary bg-white/95 m-0 p-0', isFocused && "outline-none ring-2 ring-blue-500", props.className),
                control: () => cn('border-none px-3 py-1.5'),
                menu: () => cn('text-gray-900 rounded mt-1 bg-gray-100 m-0 p-0 min-w-fit z-1 ring ring-blue-500'),
                groupHeading: () => cn('text-gray-400 bg-gray-100 text-xs border-b border-gray-200 px-4 pt-1 pb-0.5 z-100 first-of-type:rounded-t'),
                option: ({isFocused, isSelected}) => cn("text-gray-600 whitespace-nowrap px-2 py-1 m-0", isFocused && 'bg-white/45 text-gray-400', isSelected && 'bg-white/80 text-gray-700'),
            }}
            value={optionForValue(props.value ?? props.defaultValue ?? null)}
            options={props.options}
            onChange={props.onChange}
        />
    )
}

export default SearchableSelect;