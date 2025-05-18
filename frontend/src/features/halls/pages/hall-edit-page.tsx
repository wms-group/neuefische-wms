import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Aisle, Hall } from "@/types";
import LayoutContainer from "@/components/shared/layout-container.tsx";
import { useHalls } from "@/features/halls";
import { EditableAisleList, useAisles } from "@/features/aisles";
import { cn } from "@/utils";

const HallEditPage = () => {
    const { addHall, updateHall, fetchHall } = useHalls();
    const { id } = useParams();
    const navigate = useNavigate();

    const isCreationPage = id === undefined;

    const [hall, setHall] = useState<Hall>(
        isCreationPage
            ? { id: "", name: "", aisleIds: [] }
            : { id: "", name: "", aisleIds: [] }
    );
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

    const { aisles } = useAisles();
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
            await addHall({ name: hall.name, aisleIds: hall.aisleIds });
        } else {
            await updateHall(hall);
        }
        navigate(-1);
    };

    const setAisles = (aisles: Aisle[]) => {
        const newAisleIds = aisles.map(a => a.id);
        const hasDiff =
            hall.aisleIds.length !== newAisleIds.length ||
            hall.aisleIds.some(id => !newAisleIds.includes(id)) ||
            newAisleIds.some(id => !hall.aisleIds.includes(id));
        if (hasDiff) {
            setHall({ ...hall, aisleIds: newAisleIds });
            setHallAisles(aisles);
        }
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setHall({ ...hall, name: event.target.value });
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
            <div className="flex-col">
                <h2 className="text-xl mb-4">{isCreationPage ? "Neue Halle" : "Halle Bearbeiten"}</h2>
                
                <form className="h-full grow flex-basis-60" onSubmit={handleSubmit}>
                    <label htmlFor="name" className={cn("text-sm/6 font-medium text-gray")}>Name</label>
                    <input
                        name="name"
                        className={cn(
                            'block w-full rounded border-none bg-white/95 px-3 py-1.5 text-gray-900',
                            'focus:not-data-focus:outline-none data-focus:outline-2 data-focus:-outline-offset-2 data-focus:outline-gray-900'
                        )}
                        onChange={handleChange}
                        value={hall.name}
                    />
                    {
                        isCreationPage && <button
                        type="submit"
                        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded disabled:bg-blue-300"
                        disabled={hall.name === ""}
                        >
                            Halle Erstellen
                        </button>
                    }
                    
                </form>
                
                <h3 className="text-l mb-4">Gänge:</h3>
                <EditableAisleList aisles={hallAisles} setAisles={setAisles} />

            </div>
        </LayoutContainer>
    );
};

export default HallEditPage;
