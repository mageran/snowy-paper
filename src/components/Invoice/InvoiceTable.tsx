import MonetaryEntityTable from "../generic/MonetaryEntity/MonetaryEntityTable";
import { Invoice, InvoiceStatus } from "./invoice";

const InvoiceTable = MonetaryEntityTable<Invoice, InvoiceStatus>;
export default InvoiceTable;