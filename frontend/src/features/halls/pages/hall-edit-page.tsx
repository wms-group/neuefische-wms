import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {Aisle, ButtonType, Hall} from "@/types";
import LayoutContainer from "@/components/shared/layout-container.tsx";
import {useHalls} from "@/features/halls";
import {EditableAisleList, useAisles} from "@/features/aisles";
import {Button, InputWithLabel} from "@/components/ui";

const HallEditPage = () => {
    const {addHall, updateHall, fetchHall} = useHalls();
    const {id} = useParams();
    const navigate = useNavigate();

    const isCreationPage = id === undefined;

    const [hall, setHall] = useState<Hall>({
        id: "", name: "", aisleIds: []
    });
    const [loading, setLoading] = useState(!isCreationPage);

    useEffect(() => {
        if (!isCreationPage && id) {
            setLoading(true);
            fetchHall(id)
                .then((fetchedHall: Hall | undefined) => {
                    if (fetchedHall) {
                        setHall(fetchedHall);
                    }
                })
                .finally(() => setLoading(false));
        }
    }, [id, isCreationPage, fetchHall]);

    const {aisles} = useAisles();
    const getHallAisles = (): Aisle[] => {
        return hall.aisleIds.map(aid => aisles.find(a => a.id === aid)).filter(Boolean) as typeof aisles;
    };
    const [hallAisles, setHallAisles] = useState<Aisle[]>([]);
    useEffect(() => {
        if (!isCreationPage) {
            setHallAisles(getHallAisles());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hall, aisles, isCreationPage]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (isCreationPage) {
            const createdHall = await addHall({ name: hall.name, aisleIds: hall.aisleIds });
            if(createdHall) {
                navigate(`/halls/${createdHall.id}/edit`);
            }
        } else {
            await updateHall(hall);
        }
    };

    const setAisles = (aisles: Aisle[]) => {
        const newAisleIds = aisles.map(a => a.id);
        const hasDiff =
            (hall.aisleIds?.length ?? 0) !== (newAisleIds?.length ?? 0) ||
            (hall.aisleIds ?? []).some(id => !(newAisleIds ?? []).includes(id)) ||
            (newAisleIds ?? []).some(id => !(hall.aisleIds ?? []).includes(id));
        console.log("Halls Aisles: ", hall.aisleIds, "New Aisle State: ", aisles.map(a => a.id))

        if (hasDiff) {
            setHall({...hall, aisleIds: newAisleIds});
            setHallAisles(aisles);
            updateHall({...hall, aisleIds: newAisleIds});
        }
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setHall({...hall, name: event.target.value});
    };

    if (loading) {
        return (
            <LayoutContainer>
                <div>Loading...</div>
            </LayoutContainer>
        );
    }

    return (
        <LayoutContainer>
            <h2 className="text-xl mb-4">{isCreationPage ? "Neue Halle" : "Halle Bearbeiten"}</h2>

            <form className="flex items-end gap-4 max-w-4xl" onSubmit={handleSubmit}>
                <InputWithLabel
                    label="Halle Name:"
                    name={"halle"}
                    value={hall.name}
                    onChange={handleChange}
                />

                {
                    isCreationPage && <Button
                        type={ButtonType.submit}
                        className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-blue-300"
                        disabled={!hall.name}
                    >
                        Halle Erstellen
                    </Button>
                }

            </form>
            {
                !isCreationPage &&
                    <EditableAisleList aisles={hallAisles} setAisles={setAisles} />
            }
        </LayoutContainer>
    );
};

export default HallEditPage;
