import { useSelector } from "react-redux";
import { MonetaryEntityList, MonetaryEntity } from "./monetary-entity";
import { RootState } from "../../../lib/redux/redux";

import { useDensity, useTheme } from "@salt-ds/core";
import type { GridReadyEvent } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { useEffect, useMemo, useState } from "react";
import type { Field } from "./monetary-entity"

import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
ModuleRegistry.registerModules([AllCommunityModule]);
import { CellSelectionModule } from 'ag-grid-enterprise';

ModuleRegistry.registerModules([CellSelectionModule]);



interface MonetaryEntityTableProps<T extends MonetaryEntity<StatusType>, StatusType = string> {
  entities?: MonetaryEntityList<T, StatusType>;
}


const MonetaryEntityTable = <T extends MonetaryEntity<StatusType>, StatusType>({
  entities,
}: MonetaryEntityTableProps<T, StatusType>) => {
  const fields = entities?.getAllFields();

  const [tableData, setTableData] = useState<T[]>([])

  // getting the data from redux store
  const sliceName = entities?.sliceName;
  const data = useSelector((state: RootState) => state[sliceName].entities);
  const tableStatus = useSelector((state: RootState) => state[sliceName].tableStatus);

  const { mode } = useTheme();
  const density = useDensity();
  const onGridReady = ({ api }: GridReadyEvent) => {
    api.sizeColumnsToFit();
  }

  const rowHeight = useMemo(() => {
    switch (density) {
      case "high":
        return 25;
      case "medium":
        return 37;
      case "low":
        return 49;
      case "touch":
        return 61;
      default:
        return 25;
    }
  }, [density]);

  const columnDefs = fields?.map((fld: Field) => {
    const textAlign = fld.displayDatatype === 'moneyAmount' ? 'right' : 'left';
    return {
      headerName: fld.header,
      cellStyle: { textAlign },
      valueGetter: (params: { data: any; }) => {
        const { data } = params;
        if (typeof fld.display === 'function') {
          return fld.display(data);
        } else {
          return data[fld.id];
        }
      }
    }
  }) ?? [];

  useEffect(() => {
    setTableData(!tableStatus ? data : data.filter((entity: { status: StatusType; }) => entity.status === tableStatus));
  }, [data, tableStatus]);

  return (
    <div
      className={`ag-theme-salt-${mode}`}
      style={{ height: 500, width: "100%" }}
    >
      <div>TableStatus: {tableStatus}</div>
      <AgGridReact
        columnDefs={columnDefs}
        rowData={tableData}
        rowSelection="single"
        cellSelection={true}
        onGridReady={onGridReady}
        rowHeight={rowHeight}
      />
    </div>
  );
};

export default MonetaryEntityTable;