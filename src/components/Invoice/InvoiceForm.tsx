import MonetaryEntityForm from "../generic/MonetaryEntity/MonetaryEntityForm";
import { Invoice, InvoiceStatus } from "./invoice";

const InvoiceForm = MonetaryEntityForm<Invoice, InvoiceStatus>;
export default InvoiceForm;