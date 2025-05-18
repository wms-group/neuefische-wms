import { useState, useEffect } from "react";
import { NavLink, useParams } from "react-router-dom";
import { Hall } from "@/types";
import LayoutContainer from "@/components/shared/layout-container.tsx";
import { useHalls } from "@/features/halls";

const HallDetailPage = () => {
    const { fetchHall } = useHalls();
    const { id } = useParams();
    const [hall, setHall] = useState<Hall | undefined>(undefined);

    useEffect(() => {
        const fetch = async () => {
            const result = await fetchHall(id || "");
            setHall(result);
        };
        fetch();
    }, [fetchHall, id]);

    return <LayoutContainer>
        <div className="flex justify-between h-max">
            <h2 className="text-xl mb-4">Hall: {hall?.name}</h2>
            <NavLink to={"edit"} className="mb-4 px-4 py-2 bg-blue-500 text-white rounded">
                        Edit</NavLink>
        </div>

    </LayoutContainer>;
};

export default HallDetailPage;
