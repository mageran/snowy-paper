import { useSelector } from "react-redux";
import { MonetaryEntity, MonetaryEntityList } from "./monetary-entity";
import { RootState } from "../../../lib/redux/redux";
import { useEffect, useState } from "react";

interface MonetaryEntityStatusCardProps<T extends MonetaryEntity<StatusType>, StatusType = string> {
    entities?: MonetaryEntityList<T, StatusType>;
    status: StatusType;
}

const MonetaryEntityStatusCard = <T extends MonetaryEntity<StatusType>, StatusType>({
    entities,
    status
}: MonetaryEntityStatusCardProps<T, StatusType>) => {
    // getting the data from redux store
    const sliceName = entities?.sliceName;
    const data = useSelector((state: RootState) => state[sliceName].entities)

    const [entiesWithStatus, setEntitiesWithStatus] = useState<T[]>([])

    useEffect(() => {
        setEntitiesWithStatus(data.filter((entity:any) => entity.status === status))
    }, [data])

    return (
        <div>Status:{status as string}: {entiesWithStatus.length}</div>
    )
}

export default MonetaryEntityStatusCard;