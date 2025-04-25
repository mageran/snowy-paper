import { useDispatch, useSelector } from "react-redux";
import { MonetaryEntity, MonetaryEntityList } from "./monetary-entity";
import { AppDispatch, RootState } from "../../../lib/redux/redux";
import { useCallback, useEffect, useState } from "react";
import { FlexItem, FlexLayout, InteractableCard, Label, StackLayout } from "@salt-ds/core";
import { camelCaseToLabel, formatAmount } from "../../../lib/utils";

const TOPN_ITEM_IN_CARD = 3;

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
    const fieldForCard = entities?.getEntityFieldForStatusCard();

    const data = useSelector((state: RootState) => state[sliceName].entities);
    const tableStatus = useSelector((state: RootState) => state[sliceName].tableStatus);
    const dispatch = useDispatch<AppDispatch>();
    const { setTableStatus, clearTableStatus } = (sliceActions as { setTableStatus: any, clearTableStatus: any });

    const statusLabel = camelCaseToLabel(status ? (status as string) : 'All');

    const [entitiesWithStatus, setEntitiesWithStatus] = useState<T[]>([])
    const [topNEntities, setTopNEntities] = useState<T[]>([]);
    const [totalStatusAmount, setTotalStatusAmount] = useState<number>(0);

    useEffect(() => {
        setEntitiesWithStatus(data
            .filter((entity: any) => status ? entity.status === status : true)
        )
    }, [data])

    useEffect(() => {
        setTotalStatusAmount(entitiesWithStatus.reduce((sum, entity) => sum + entity.value, 0));
        const entitiesCopy = [...entitiesWithStatus];
        entitiesCopy.sort((e1: T, e2: T) => e1.value > e2.value ? -1 : e1.value < e2.value ? 1 : 0);
        const topEntities = entitiesCopy.slice(0, TOPN_ITEM_IN_CARD);
        console.log("topEntities: %o", topEntities);
        setTopNEntities(topEntities);
    }, [entitiesWithStatus])

    const activateStatus = () => {
        dispatch(status ? setTableStatus(status) : clearTableStatus());
    }

    const isActiveStatus = useCallback(() => {
        return tableStatus == status;
    }, [tableStatus]);

    return (
        <InteractableCard
            accent="top"
            style={{ padding: '2px', width: "260px", height: "144px", ...(isActiveStatus() ? { backgroundColor: 'var(--salt-target-background-hover)' } : {}) }}
            onClick={activateStatus}
        >
            <FlexLayout direction="column" gap={0.1}>
                <StackLayout direction="row" align="start">
                    <div style={{ fontSize: '18pt', fontWeight: "bold", lineHeight: 1.2 }}>{statusLabel}</div>
                </StackLayout>
                <FlexLayout direction="row" align="start"
                    style={{ width: '100%', border: '10px transparent solid' }}
                >
                    <div></div>
                    <div style={{ fontSize: "16pt" }}>{formatAmount(totalStatusAmount)}</div>
                </FlexLayout>
                {topNEntities.map((entity, index) => {
                    return (
                        <StackLayout key={index} direction="row" style={{ border: '0px solid black'}}>
                            <div
                                style={{
                                    whiteSpace: 'nowrap',
                                    textOverflow: 'ellipsis',
                                    overflow: 'hidden',
                                    width: '50%'
                                }}
                            >{(entity as Record<string, any>)[fieldForCard??'id']}</div>
                            <div>{formatAmount(entity.value)}</div>
                        </StackLayout>
                    )
                })}
            </FlexLayout>
        </InteractableCard>
    )
}

export default MonetaryEntityStatusCard;