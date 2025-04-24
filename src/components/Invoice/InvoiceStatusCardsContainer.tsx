import MonetaryEntityStatusCardsContainer from "../generic/MonetaryEntity/MonetaryEntityStatusCardsContainer";
import { Invoice, InvoiceStatus } from "./invoice";

const InvoiceStatusCardsContainer = MonetaryEntityStatusCardsContainer<Invoice, InvoiceStatus>;
export default InvoiceStatusCardsContainer;