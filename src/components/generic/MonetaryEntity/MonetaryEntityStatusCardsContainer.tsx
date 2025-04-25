import { StackLayout } from "@salt-ds/core";
import { MonetaryEntity, MonetaryEntityList } from "./monetary-entity";
import MonetaryEntityStatusCard from "./MonetaryEntityStatusCard";

interface MonetaryEntityStatusCardsContainerProps<T extends MonetaryEntity<StatusType>, StatusType = string> {
    entities?: MonetaryEntityList<T, StatusType>;
}

const MonetaryEntityStatusCardsContainer = <T extends MonetaryEntity<StatusType>, StatusType>({
    entities,
}: MonetaryEntityStatusCardsContainerProps<T, StatusType>) => {
    const statusTypeValues = entities?.getStatusTypeValues() ?? [];

    return (
        <StackLayout
            direction="row"
            style={{ width: '100%' }}
        >
        {statusTypeValues.map((statusValue, index) => {
            return (
                <MonetaryEntityStatusCard
                    key={index} 
                    entities={entities}
                    status={statusValue as StatusType}
                />
            )
        })}
        <MonetaryEntityStatusCard
            key={statusTypeValues.length}
            entities={entities}
            status={null as StatusType}
        />
        </StackLayout>
    )
}

export default MonetaryEntityStatusCardsContainer;