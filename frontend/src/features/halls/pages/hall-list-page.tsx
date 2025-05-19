import {useEffect} from "react";
import {NavLink} from "react-router-dom";
import LayoutContainer from "@/components/shared/layout-container.tsx";
import {Hall} from "@/types";
import {useHalls} from "@/features/halls";

const HallListPage = () => {
    const { halls, fetchHalls } = useHalls();

    useEffect(() => {
        fetchHalls();
    }, [fetchHalls]);

    return (
        <LayoutContainer className={"h-full"}>
            <div className="flex justify-between h-max">
                <h2 className="text-xl mb-4">Halls</h2>
                <NavLink to={"new"} className="mb-4 px-4 py-2 bg-blue-500 text-white rounded disabled:bg-blue-300">
                    Add Hall</NavLink>
            </div>

            <ul className="space-y-2">
                {halls.map((h: Hall) => 
                    <NavLink to={h.id} key={h.id}>
                        <div className="flex justify-start gap-3">
                            <h3>{h.name}</h3>
                            <div>Aisle Count: {h.aisleIds.length}</div>
                        </div>
                    </NavLink>
                )}
            </ul>
        </LayoutContainer>
    );
};

export default HallListPage;
