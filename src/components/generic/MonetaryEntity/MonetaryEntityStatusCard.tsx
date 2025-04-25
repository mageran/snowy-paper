import { useDispatch, useSelector } from "react-redux";
import { MonetaryEntity, MonetaryEntityList } from "./monetary-entity";
import { AppDispatch, RootState } from "../../../lib/redux/redux";
import { useEffect, useState } from "react";
import { Button, InteractableCard, StackLayout } from "@salt-ds/core";
import { camelCaseToLabel, formatAmount } from "../../../lib/utils";

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

    const statusLabel = camelCaseToLabel(status ? (status as string) : 'All');

    const [entiesWithStatus, setEntitiesWithStatus] = useState<T[]>([])
    const [totalStatusAmount, setTotalStatusAmount] = useState<number>(0);

    useEffect(() => {
        setEntitiesWithStatus(data.filter((entity:any) => status ? entity.status === status : true))
    }, [data])

    useEffect(() => {
        setTotalStatusAmount(entiesWithStatus.reduce((sum, entity) => sum + entity.value, 0))
    }, [entiesWithStatus])

    const activateStatus = () => {
        dispatch(status ? setTableStatus(status) : clearTableStatus());
    }

    return (
        <InteractableCard accent="top" style={{ width: "260px", height: "144px" }} onClick={activateStatus}>
            <StackLayout direction="column">
                <h2>{statusLabel} ({entiesWithStatus.length})</h2>
                <h3>{formatAmount(totalStatusAmount)}</h3>
            </StackLayout>
        </InteractableCard>
    )
}

export default MonetaryEntityStatusCard;