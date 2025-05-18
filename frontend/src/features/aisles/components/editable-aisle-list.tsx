import { Aisle } from '@/types'
import EditableAisleCard from './editable-aisle-card';
import { useAisles } from '../hooks/useAisles';
import useCategories from '@/hooks/useCategories';
import Button from '@/components/ui/button';

type EditableListProps = {
    aisles: Aisle[];
    setAisles: (aisles: Aisle[]) => void;
}

const EditableAisleList = ({ aisles, setAisles }: EditableListProps) => {
    const { categories } = useCategories();
    
    const emptyAisle = {id:"", 
        name: "", 
        categoryIds: [],
        stockIds: []
    };
    
    const {updateAisle, addAisle, removeAisle} = useAisles();

    const removeExistingAisle = async (aisle: Aisle) => {
        await removeAisle(aisle.id);
        setAisles([
            ...aisles.filter(a => a.id !== aisle.id)
        ]);
    }

    const handleEditSubmit = async (aisle: Aisle): Promise<Aisle | undefined> => {
        return await updateAisle(aisle);
    }

    const handleCreateSubmit = async (aisle: Aisle): Promise<Aisle | undefined> => {
        const createdAisle = await addAisle(aisle);
        if(createdAisle === undefined) {
            return createdAisle;
        }

        setAisles([
            createdAisle,
            ...aisles
        ]);
    }

    return (
        <ul className='p-2 flex flex-col gap-4'>
            <li>
                <EditableAisleCard aisle={emptyAisle} categories={categories} creates onSubmit={handleCreateSubmit} />
            </li>
            {
                aisles.map(a => <li key={a.id}>
                        <EditableAisleCard aisle={a} categories={categories} onSubmit={handleEditSubmit} actions={
                            <Button 
                                className="bg-red-200 px-4 py-2 text-sm text-red-800 hover:bg-red-300 active:bg-red-400 transition-colors"
                                onClick={() => removeExistingAisle(a)}>
                                Delete
                            </Button>}
                        />
                </li>)
            }
        </ul>
    )
}

export default EditableAisleList