import {CategoryOutputDTO} from '@/types'
import {Button} from "@/components/ui";
import {X} from "lucide-react";

type CategoryPillProps = {
    category: CategoryOutputDTO;
    onRemove: (id: string) => void;
};

const CategoryPill = ({ category, onRemove }: CategoryPillProps) => {
    return (
        <div
            className="inline-flex items-center px-2 py-1 rounded-full bg-gray-200 text-gray-800 text-sm font-medium select-none transition"
            aria-label={category.name}
        >
            {category.name}
            <Button
                iconOnly
                onClick={() => onRemove(category.id)}
                className="text-gray-500 hover:text-red-600 focus:outline-none text-xs p-0.75 bg-transparent"
                aria-label={`Remove ${category.name}`}
            >
               <X />
            </Button>
        </div>
    )
}

export default CategoryPill
