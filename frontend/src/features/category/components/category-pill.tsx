import {CategoryOutputDTO} from '@/types'
import {Button} from "@/components/ui";
import {X} from "lucide-react";
import {cn} from "@/utils";

type CategoryPillProps = {
    category: CategoryOutputDTO;
    onRemove?: (id: string) => void;
};

const CategoryPill = ({ category, onRemove }: CategoryPillProps) => {
    return (
        <div
            className={cn("inline-flex items-center pl-4 px-4 py-2 rounded-full bg-gray-200 text-gray-800 text-sm font-medium select-none transition",
                onRemove && "px-2 py-1")}
            aria-label={category.name}
        >
            {category.name}

            {onRemove && (
                <Button
                    iconOnly
                    onClick={onRemove && (() => onRemove(category.id))}
                    className="text-gray-500 hover:text-red-600 focus:outline-none text-xs p-0.75 bg-transparent"
                    aria-label={`Remove ${category.name}`}
                >
                    <X />
                </Button>
            )}
        </div>
    )
}

export default CategoryPill
