import { Aisle } from '@/types';
import useCategories from '@/hooks/useCategories';
import StaticAisleCard from './static-aisle-card';

type Props = {
    aisles: Aisle[];
}

const AisleList = ({ aisles }: Props) => {
    const { categories } = useCategories();

    return (
        <ul className='p-2 flex flex-col gap-4'>
            {aisles.map((a) => (<li key={a.id}>
                    <StaticAisleCard aisle={a} categories={categories}/>
                </li>
                ))}
        </ul>
    );
}

export default AisleList