import {CategoryOutputDTO} from "@/types";
import Card from "@/components/shared/card.tsx";
import { Link } from "react-router-dom";

type CategoryCardProps = {
    category: CategoryOutputDTO;
    countSubCategories: number;
    className?: string;
}

const CategoryCard = ({category, countSubCategories, className}: CategoryCardProps) => {
    return (
        countSubCategories === 0 ? (
            <Card title={category.name} actions={"not ready yet"} className={className}>
                <span className="text-gray-500">Keine Unterkategorien</span>
            </Card> ) : (
                <Card title={category.name} actions={"not ready yet"} className={className}>
                    <Link to={"/categories/" + category.id}>{countSubCategories} Kategorie{countSubCategories > 1 || countSubCategories == 0 ? "n" : ""}</Link>
                </Card>
        )
    )
}

export default CategoryCard;