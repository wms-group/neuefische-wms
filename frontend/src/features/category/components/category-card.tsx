import {CategoryOutputDTO} from "@/types";
import Card from "@/components/shared/card.tsx";
import {cn} from "@/utils";
import CategoryLink from "@/features/category/ui/CategoryLink.tsx";

type CategoryCardProps = {
    category: CategoryOutputDTO;
    countSubCategories: number;
    className?: string;
}

const CategoryCard = ({category, countSubCategories, className}: CategoryCardProps) => {
    return (
        <Card title={category.name} actions={"not ready yet"} className={cn(className, "max-w-2xl")}>
            <CategoryLink category={category}>{countSubCategories ? (countSubCategories + " Unterkategorien") : ("keine Unterkategorien")}</CategoryLink>
        </Card>
    )
}

export default CategoryCard;