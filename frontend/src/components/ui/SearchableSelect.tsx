import {SelectGroup, SelectOption} from "@/types";
import Select from "react-select";
import {FC} from "react";
import {cn} from "@/utils";

type SearchableSelectProps = {
    name: string;
    options: SelectOption[] | SelectGroup[];
    value?: string | null;
    onChange: (newValue: SelectOption | null) => void;
    emptyLabel?: string;
    defaultValue?: string | null;
}

const SearchableSelect: FC<SearchableSelectProps> = (props) => {
    const flatOptions = props.options.flatMap(o => 'value' in o ? o : o.options);

    return (
        <Select
            name={props.name}
            unstyled={true}
            classNames={{
                container: () => cn('text-gray-900'),
                control: ({isFocused}) => cn('rounded bg-white/95 m-0 px-3 py-1.5', isFocused && 'outline-2 outline-'),
                menu: () => cn('rounded mt-1 bg-element-bg m-0 p-0'),
                groupHeading: () => cn('text-gray-400 bg-element-bg text-xs border-b border-gray-200 px-4 pt-1 pb-0.5 z-100'),
                option: ({isFocused, isSelected}) => cn("text-gray-600 whitespace-nowrap px-2 py-1 m-0", isFocused && 'bg-primary', isSelected && 'bg-gray-500 text-white'),
            }}
            value={{
                'label': flatOptions.find(o => o.value === (props.value ?? props.defaultValue))?.label ?? props.emptyLabel ?? "- keine -",
                'value': flatOptions.find(o => o.value === (props.value ?? props.defaultValue))?.value ?? "" }}
            options={props.options}
            onChange={props.onChange}
        />
    )
}

export default SearchableSelect;