import {Aisle} from '@/types';
import useCategories from '@/hooks/useCategories';
import StaticAisleCard from './static-aisle-card';
import GridLayout from "@/components/shared/grid-layout.tsx";

type Props = {
    aisles: Aisle[];
}

const AisleList = ({aisles}: Props) => {
    const {categories, loading} = useCategories();

    return (
        <GridLayout className={"py-4"} gridCols={{base: 1, sm: 2, md: 2, xl: 3}}>
            {aisles.map((a) => (
                <StaticAisleCard
                    key={a.id}
                    aisle={a}
                    categories={categories}
                    isLoading={loading}
                />
            ))}
        </GridLayout>
    );
}

export default AisleList