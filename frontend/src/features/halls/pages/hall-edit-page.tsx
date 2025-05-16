import LayoutContainer from "@/components/shared/layout-container.tsx";
import { useState } from "react";
import { Hall } from "../types/hall";
import { useNavigate, useParams } from "react-router-dom";
import { useHalls } from "../hooks/useHalls";


const HallEditPage = () => {
    const { halls, addHall, updateHall } = useHalls();
    const { id } = useParams();
    const navigate = useNavigate();

    const isCreationPage = id === undefined;
    
    const hall = halls.find((h) => h.id === id) ?? {id: "", name: "", aisleIds: [] };

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
        
        setEditedHall({ ...editedHall, name: event.target.value });
    };

    return <LayoutContainer>
        <form className="flex-col" onSubmit={handleSubmit}>
            <h2 className="text-xl mb-4">New Hall</h2>
            <label>
            Hall Name: 
                <input value={editedHall.name} 
                    onChange={handleNameChange}
                    className="mb-4 px-2 py-1 border rounded">
                    
                </input>
            </label>

            {/* TODO: Aisle editing will go here */}

            <button type="submit" 
            className="mb-4 px-4 py-2 bg-blue-500 text-white rounded disabled:bg-blue-300"
            disabled={editedHall.name === ""}>
                { isCreationPage ? "AddHall" : "Edit" }
            </button>


        </form>

    </LayoutContainer>;
};

export default HallEditPage;
