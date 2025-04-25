import { useDispatch, useSelector } from "react-redux";
import { MonetaryEntity, MonetaryEntityList } from "./monetary-entity";
import { AppDispatch, RootState } from "../../../lib/redux/redux";
import { useEffect, useState } from "react";
import { Button } from "@salt-ds/core";

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
    const slice = entities?.slice;
    const sliceActions = slice?.actions;
    const data = useSelector((state: RootState) => state[sliceName].entities)
    const dispatch = useDispatch<AppDispatch>();
    const { setTableStatus, clearTableStatus } = (sliceActions as { setTableStatus: any, clearTableStatus: any });

    const statusLabel = status ? (status as string) : 'All';

    const [entiesWithStatus, setEntitiesWithStatus] = useState<T[]>([])

    useEffect(() => {
        setEntitiesWithStatus(data.filter((entity:any) => status ? entity.status === status : true))
    }, [data])

    return (
        <div>
            <Button
            onClick={() => {
                dispatch(status ? setTableStatus(status) : clearTableStatus());
            }}
            >Status:{statusLabel}: {entiesWithStatus.length}</Button>
        </div>
    )
}

export default MonetaryEntityStatusCard;