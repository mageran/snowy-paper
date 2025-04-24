import { MonetaryEntityList, MonetaryEntity } from "./monetary-entity";

interface MonetaryEntityTableProps<T extends MonetaryEntity<StatusType>, StatusType = string> {
    entities?: MonetaryEntityList<T, StatusType>;
}


const MonetaryEntityTable = <T extends MonetaryEntity<StatusType>, StatusType>({
    entities,
}: MonetaryEntityTableProps<T, StatusType>) => {
    //const fields = entities.getAllFields();
    const data = entities?.entities;

    return (
        <>
        <h1>Monetary Entity Table</h1>
        <pre>{JSON.stringify(data)}</pre>
        </>
    );
};

export default MonetaryEntityTable;