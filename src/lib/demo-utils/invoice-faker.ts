import { InvoiceObject, InvoiceStatusValues } from "../../components/Invoice/invoice";
import { faker } from "@faker-js/faker";
import { dateInNDays } from "../utils";

export const createFakeInvoice = (): InvoiceObject => {
    const id = `INV-${faker.string.numeric(5)}`;
    const currency = 'USD';
    const value = faker.finance.amount({ min: 20, max: 5000 });
    const status = faker.helpers.arrayElement(InvoiceStatusValues);
    const customerName = faker.company.name();
    const notes = faker.lorem.words({ min: 3, max: 8});
    const invoiceDate = faker.date.recent({ days: 90 });
    const dueInDays = faker.helpers.arrayElement([45, 60, 90]);
    const dueDate = new Date(invoiceDate);
    dueDate.setDate(dueDate.getDate() + dueInDays);
    return InvoiceObject.createInvoiceFromRecord({
        id,
        currency,
        value,
        status,
        customerName,
        invoiceDate,
        dueDate,
        notes,
    })
}