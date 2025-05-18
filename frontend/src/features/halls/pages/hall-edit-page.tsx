import { useEffect, useState } from "react";
import { Hall } from "@/types";
import { useNavigate, useParams } from "react-router-dom";
import LayoutContainer from "@/components/shared/layout-container.tsx";
import { Hall } from "@/types";
import { useHalls } from "@/features/halls";


const HallEditPage = () => {
    const { addHall, updateHall, fetchHall } = useHalls();
    const { id } = useParams();
    const navigate = useNavigate();

    const isCreationPage = id === undefined;
    
    const [hall, setHall] = useState<Hall>(
         { id: "", name: "", aisleIds: [] }
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


    const [ editedHall, setEditedHall ] = useState<Hall>(hall);

    const  handleSubmit = async (event: React.ChangeEvent<HTMLFormElement>) => {
        event.preventDefault();
        if(isCreationPage) {
            await addHall({name: editedHall.name, aisleIds: editedHall.aisleIds});
        } else {
            updateHall(editedHall);
        }

        navigate(-1);
    }

    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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
        <form className="flex-col" onSubmit={handleSubmit}>
                <h2 className="text-xl mb-4">{isCreationPage ? "New Hall" : "Edit Hall"}</h2>
            <label>
            Hall Name: 
                    <input
                        value={hall.name}
                    onChange={handleNameChange}
                        className="mb-4 px-2 py-1 border rounded"
                    />
            </label>

            {/* TODO: Aisle editing will go here */}

                <button
                    type="submit"
            className="mb-4 px-4 py-2 bg-blue-500 text-white rounded disabled:bg-blue-300"
                    disabled={hall.name === ""}
                >
                    {isCreationPage ? "Add" : "Apply Changes"}
            </button>
        </form>
        </LayoutContainer>
    );
};

export default HallEditPage;
