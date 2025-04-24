import { MonetaryEntity, MonetaryEntityContainer, Field } from "../generic/MonetaryEntity/monetary-entity";
import { camelCaseToLabel } from "../../lib/utils";

type InvoiceStatus = 'draft' | 'pendingApproval' | 'awaitingPayment' | 'due' | 'pastDue' | 'paid';

interface Invoice extends MonetaryEntity<InvoiceStatus> {
    customerName: string,
    invoiceDate: Date,
}

/**
 * A container class for managing invoices.
 * 
 * This class extends the `MonetaryEntityContainer` to provide additional functionality
 * specific to invoices, such as defining extension fields.
 */
export class InvoiceContainer extends MonetaryEntityContainer<Invoice, InvoiceStatus> {
    /**
     * Returns the extension fields specific to invoices.
     * These fields include additional metadata such as the customer name and invoice date.
     * 
     * @returns An array of `Field` objects representing the extension fields.
     */
    getExtensionFields(): Field[] {
        return [
            {
                id: "customerName",
                displayDatatype: "string",
                header: "Customer Name",
                display: (object: MonetaryEntity) => (object as Invoice).customerName,
            },
            {
                id: "invoiceDate",
                displayDatatype: "date",
                header: "Invoice Date",
                display: (object: MonetaryEntity) => (object as Invoice).invoiceDate.toLocaleDateString(),
            },
        ];
    }

    /**
     * Returns the header for the "Status" field, customized for invoices.
     * 
     * @returns A string representing the header for the "Status" field.
     */
    getStatusHeader(): string {
        return "Invoice Status";
    }

    /**
     * Returns the string representation of a given invoice status using camelCaseToLabel.
     * 
     * @param invoice - The invoice whose status needs to be converted to a label.
     * @returns The formatted status label.
     */
    getStatusLabel(invoice: Invoice): string {
        return camelCaseToLabel(invoice.status);
    }
}