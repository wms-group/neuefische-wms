import LayoutContainer from "@/components/shared/layout-container"
import {useParams} from "react-router-dom";


const AisleDetailPage = () => {
    const {aisleId} = useParams();
    console.log(aisleId);
    return (
        <LayoutContainer>
            AisleDetailPage
        </LayoutContainer>
    )
}

export default AisleDetailPage