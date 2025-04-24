import { MonetaryEntity, MonetaryEntityList, Field } from "../generic/MonetaryEntity/monetary-entity";
import { camelCaseToLabel } from "../../lib/utils";

const InvoiceStatusValues = ['draft', 'pendingApproval', 'awaitingPayment', 'due', 'pastDue', 'paid'];

export type InvoiceStatus = typeof InvoiceStatusValues[number];

export interface Invoice extends MonetaryEntity<InvoiceStatus> {
    customerName: string,
    invoiceDate: Date,
}

export class InvoiceObject implements Invoice {
    //public container?: InvoiceList;
    id: string;
    value: number;
    currency?: string | undefined;
    status?: InvoiceStatus | undefined;
    customerName: string;
    invoiceDate: Date;
    
    constructor(
        //container: InvoiceList,
        id: string,
        value: number,
        status: InvoiceStatus,
        customerName: string,
        invoiceDate: Date,
        currency?: string,
    ) {
            //this.container = container;
            this.id = id;
            this.value = value;
            this.currency = currency;
            this.status = status;
            this.customerName = customerName;
            this.invoiceDate = invoiceDate;
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
        let invoiceDate = new Date();
        try {
            invoiceDate = new Date(String(data.invoiceDate))
        } catch(err:unknown) {

        }
        return new InvoiceObject(id, value, status, customerName, invoiceDate, currency)
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
        return camelCaseToLabel(invoice.status??'undefined');
    }
}