import { useSelector } from "react-redux";
import { MonetaryEntityList, MonetaryEntity } from "./monetary-entity";
import { RootState } from "../../../lib/redux/redux";

interface MonetaryEntityTableProps<T extends MonetaryEntity<StatusType>, StatusType = string> {
    entities?: MonetaryEntityList<T, StatusType>;
}


const MonetaryEntityTable = <T extends MonetaryEntity<StatusType>, StatusType>({
    entities,
}: MonetaryEntityTableProps<T, StatusType>) => {
    //const fields = entities.getAllFields();
    //const data = entities?.entities;

    const sliceName = entities?.sliceName;
    const data = useSelector((state: RootState) => state[sliceName].entities)

    return (
        <>
        <pre>{JSON.stringify(data, null, 2)}</pre>
        </>
    );
};

export default MonetaryEntityTable;