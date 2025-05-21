import {useEffect, useState} from "react";
import {NavLink, useParams} from "react-router-dom";
import {Hall} from "@/types";
import LayoutContainer from "@/components/shared/layout-container.tsx";
import {useHalls} from "@/features/halls";
import {AisleList, useAisles} from "@/features/aisles";
import Button from "@/components/ui/button";

const HallDetailPage = () => {
    const { fetchHall } = useHalls();
    const { id } = useParams();
    const { aisles, fetchAisles } = useAisles();
    
    const [hall, setHall] = useState<Hall | undefined>(undefined);

    useEffect(() => {
        const fetch = async () => {
            const hallId = id === undefined ? "" : id;
            const result = await fetchHall(hallId);
            setHall(result);
        };
        fetch();
    }, [fetchHall, id]);

    useEffect(() => {
        fetchAisles();
    }, [fetchAisles]);

    const hallAisles = (hall?.aisleIds ?? [])
            .map(aid => aisles.find(a => a.id === aid))
            .filter(Boolean) as typeof aisles;

    return <LayoutContainer>
        <div className="flex justify-between h-max">
            <h2 className="text-xl mb-4">Halle: {hall?.name}</h2>
            <NavLink to={"edit"} > 
                <Button label="Bearbeiten" />
            </NavLink>
        </div>

        <h3>
            Neuen Gang erstellen:
        </h3>
        {
            hallAisles.length == 0 
            ? <div>Diese Halle hat noch keine Gänge.</div>
            : <AisleList aisles={hallAisles}/>
        }

    </LayoutContainer>;
};

export default HallDetailPage;
