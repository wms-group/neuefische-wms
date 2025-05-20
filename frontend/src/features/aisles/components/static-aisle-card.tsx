import Card from '@/components/shared/card'
import { CategoryPill } from '@/features/category'
import { Aisle, CategoryOutputDTO } from '@/types'
import { NavLink } from 'react-router-dom'

type AisleCardProps = {
    aisle: Aisle,
    categories: CategoryOutputDTO[]
}

const StaticAisleCard = ({ aisle, categories }: AisleCardProps) => {
    const aisleCategories = aisle.categoryIds.map(aid => categories.find(c => c.id === aid)).filter(Boolean) as typeof categories;

    return (
        <NavLink to={`/aisles/${aisle.id}`}>
            <Card title={aisle.name}>
                <div>
                    {
                        aisleCategories.map((c) => <CategoryPill key={c.id} category={c} />)
                    }
                </div>
                {/* TODO: add information on stock here */}
            </Card>
        </NavLink>
    )
}

export default StaticAisleCard