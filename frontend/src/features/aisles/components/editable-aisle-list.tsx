import {Aisle} from '@/types'
import EditableAisleCard from './editable-aisle-card';
import {useAisles} from '@/features/aisles';
import useCategories from '@/hooks/useCategories';
import Button from '@/components/ui/button';
import LayoutContainer from "@/components/shared/layout-container.tsx";
import GridLayout from "@/components/shared/grid-layout.tsx";

type EditableListProps = {
    aisles: Aisle[];
    setAisles: (aisles: Aisle[]) => void;
}

const EditableAisleList = ({aisles, setAisles}: EditableListProps) => {
    const {categories} = useCategories();

    const emptyAisle = {
        id: "",
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

    const handleEditSubmit = async (aisle: Aisle): Promise<Aisle> => {
        const updatedAisle = await updateAisle(aisle);
        if (!updatedAisle) {
            throw new Error("Failed to update aisle");
        }
        return updatedAisle;
    }

    const handleCreateSubmit = async (aisle: Aisle): Promise<Aisle> => {
        console.log("Create: ", aisle)
        const createdAisle = await addAisle(aisle);
        if (!createdAisle) {
            throw new Error("Failed to create aisle");
        }
        setAisles([
            createdAisle,
            ...aisles
        ]);
        return createdAisle;
    }

    return (
        <LayoutContainer className='flex flex-col gap-4 my-8'>
            <h3 className="text-l">Neuen Gang erstellen:</h3>
            <EditableAisleCard aisle={emptyAisle} categories={categories} creates onSubmit={handleCreateSubmit}/>

            <h3>Gänge: </h3>
            <GridLayout gridCols={{base: 1, sm: 2, md: 2, xl: 3}}>
                {
                    aisles.map(a =>
                        <EditableAisleCard
                            key={a.id}
                            aisle={a}
                            categories={categories}
                            onSubmit={handleEditSubmit}
                            actions={
                                <Button
                                    variant="destructive"
                                    onClick={() => removeExistingAisle(a)}>
                                    Delete
                                </Button>
                            }
                        />
                    )
                }
            </GridLayout>
        </LayoutContainer>
    )
}

export default EditableAisleList