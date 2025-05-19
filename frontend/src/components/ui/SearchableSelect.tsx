import {SelectGroup, SelectOption} from "@/types";
import Select from "react-select";
import {FC} from "react";
import {cn} from "@/utils";

type SearchableSelectProps = {
    name: string;
    options: SelectOption[] & SelectGroup[];
    value?: string | null;
    onChange: (newValue: SelectOption | null) => void;
    emptyLabel?: string;
    defaultValue?: string | null;
    mandatory?: boolean;
}

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
                container: () => cn('text-gray-900'),
                control: ({isFocused}) => cn('rounded bg-white/95 m-0 px-3 py-1.5', isFocused && 'outline-2 outline-'),
                menu: () => cn('rounded mt-1 bg-element-bg m-0 p-0'),
                groupHeading: () => cn('text-gray-400 bg-element-bg text-xs border-b border-primary px-4 pt-1 pb-0.5 z-100'),
                option: ({isFocused, isSelected}) => cn("text-gray-600 whitespace-nowrap px-2 py-1 m-0", isFocused && 'bg-primary', isSelected && 'bg-gray-500 text-white'),
            }}
            value={optionForValue(props.value ?? props.defaultValue ?? null)}
            options={props.options}
            onChange={props.onChange}
        />
    )
}

export default SearchableSelect;