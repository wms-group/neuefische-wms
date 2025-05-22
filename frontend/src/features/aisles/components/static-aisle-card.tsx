import Card from '@/components/shared/card'
import {CategoryPill} from '@/features/category'
import {Aisle, CategoryOutputDTO} from '@/types'
import {NavLink} from "react-router-dom";
import {PillSkeleton} from "@/components/ui";

type AisleCardProps = {
    aisle: Aisle,
    categories: CategoryOutputDTO[]
    isLoading?: boolean
}

const StaticAisleCard = ({aisle, categories, isLoading}: AisleCardProps) => {
    const aisleCategories = aisle.categoryIds.map(aid => categories.find(c => c.id === aid)).filter(Boolean) as typeof categories;

    return (
        <Card title={
            <NavLink className={"group aisle-action-link"} to={`${aisle.id}`}>
                {aisle.name}
            </NavLink>
        }>
            <div className={"flex flex-wrap gap-2"}>
                {isLoading && <PillSkeleton/>}
                {
                    aisleCategories.map((c) =>
                        <CategoryPill key={c.id} category={c}/>
                    )

                }
            </div>
        </Card>
    )
}

export default StaticAisleCard