import { MonetaryEntity, MonetaryEntityList, Field } from "../generic/MonetaryEntity/monetary-entity";
import { camelCaseToLabel, dateDisplay, dateFromString, dateInNDays } from "../../lib/utils";

export const InvoiceStatusValues = ['draft', 'pendingApproval', 'awaitingPayment', 'due', 'pastDue', 'paid'];

export type InvoiceStatus = typeof InvoiceStatusValues[number];

export interface Invoice extends MonetaryEntity<InvoiceStatus> {
    customerName: string;
    invoiceDate: Date;
    dueDate: Date;
    notes: string; // Added notes field
}

export class InvoiceObject implements Invoice {
    id: string;
    value: number;
    currency?: string | undefined;
    status?: InvoiceStatus | undefined;
    customerName: string;
    invoiceDate: Date;
    dueDate: Date;
    notes: string; // Added notes field

    constructor(
        id: string,
        value: number,
        status: InvoiceStatus,
        customerName: string,
        invoiceDate: Date,
        dueDate: Date,
        notes: string, // Added notes parameter
        currency?: string,
    ) {
        this.id = id;
        this.value = value;
        this.currency = currency;
        this.status = status;
        this.customerName = customerName;
        this.invoiceDate = invoiceDate;
        this.dueDate = dueDate;
        this.notes = notes; // Initialize notes
    }

    static createInvoiceFromRecord(data: Record<string, any>): InvoiceObject {
        let id = String(data.id);
        let currency = 'USD';
        let value = Number(data.value);
        let status: InvoiceStatus = InvoiceStatusValues[0];
        const statusValue = String(data.status);
        if (InvoiceStatusValues.includes(statusValue)) {
            status = statusValue as InvoiceStatus;
        }
        let customerName = String(data.customerName);
        let notes = String(data.notes || ""); // Default notes to an empty string
    
        let invoiceDate = dateFromString(data.invoiceDate);
        let dueDate = dateFromString(data.dueDate, dateInNDays(60));
        console.log("dueDate: %o", dueDate);
        return new InvoiceObject(id, value, status, customerName, invoiceDate, dueDate, notes, currency);
    }

    toJson() {
        return {
            id: this.id,
            currency: this.currency,
            value: this.value,
            status: String(this.status),
            customerName: this.customerName,
            invoiceDate: this.invoiceDate.toLocaleDateString(),
            dueDate: this.dueDate.toLocaleDateString(),
            notes: this.notes, // Include notes in JSON
        };
    }
}

/**
 * A container class for managing invoices.
 * 
 * This class extends the `MonetaryEntityContainer` to provide additional functionality
 * specific to invoices, such as defining extension fields.
 */
export class InvoiceList extends MonetaryEntityList<Invoice, InvoiceStatus> {
    entities: Invoice[] = [];

    /**
     * Returns the extension fields specific to invoices.
     * These fields include additional metadata such as the customer name, invoice date, due date, and notes.
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
                display: dateDisplay('invoiceDate'),
            },
            {
                id: "dueDate",
                displayDatatype: "date",
                header: "Due Date",
                display: dateDisplay('dueDate'),
            },
            {
                id: "notes", // Added notes field
                displayDatatype: "string",
                header: "Notes",
                display: (object: MonetaryEntity) => (object as Invoice).notes,
            },
        ];
    }

    getStatusTypeValues(): string[] {
        return InvoiceStatusValues;
    }

    getIdHeader(): string {
        return 'Invoice Id';
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
        return camelCaseToLabel(invoice.status ?? 'undefined');
    }
}