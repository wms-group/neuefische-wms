import {useEffect} from "react";
import {NavLink} from "react-router-dom";
import LayoutContainer from "@/components/shared/layout-container.tsx";
import {Hall} from "@/types";
import {useHalls} from "@/features/halls";
import Button from "@/components/ui/button";
import Card from "@/components/shared/card";
import GridLayout from "@/components/shared/grid-layout.tsx";

const HallListPage = () => {
    const {halls, fetchHalls, removeHall} = useHalls();

    useEffect(() => {
        fetchHalls();
    }, [fetchHalls]);

    const handleHallRemoval = async (hallId: string) => {
        removeHall(hallId);
    }

    return (
        <LayoutContainer>
            <div className="flex justify-between h-max mb-2">
                <h2 className="text-xl mb-4">Hallen</h2>
                <NavLink to={"new"}>
                    <Button label="Neue Halle"/>
                </NavLink>
            </div>

            <GridLayout gridCols={{base: 1, sm: 2, md: 2, xl: 3}}>
                {halls.map((h: Hall) =>
                    <Card key={h.id} title={
                        <NavLink
                            className="aisle-action-link"
                            to={h.id} key={h.id}>
                            {h.name}
                        </NavLink>
                    }
                          actions={(<Button label="Entfernen" onClick={() => handleHallRemoval(h.id)}/>)}
                    >
                        <div>Aisle Count: {h.aisleIds.length}</div>
                    </Card>
                )}
            </GridLayout>
        </LayoutContainer>
    );
};

export default HallListPage;
