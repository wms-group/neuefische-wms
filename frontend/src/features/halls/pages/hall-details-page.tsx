import LayoutContainer from "@/components/shared/layout-container.tsx";
import { NavLink, useParams } from "react-router-dom";
import { useHalls } from "../hooks/useHalls";

const HallDetailPage = () => {
    const { halls } = useHalls();
    const { id } = useParams();
    const hall = halls.find((h) => h.id === id);

    return <LayoutContainer>
        <div className="flex justify-between h-max">
            <h2 className="text-xl mb-4">Hall: {hall?.name}</h2>
            <NavLink to={"edit"} className="mb-4 px-4 py-2 bg-blue-500 text-white rounded">
                        Edit</NavLink>
        </div>

    </LayoutContainer>;
};

export default HallDetailPage;
