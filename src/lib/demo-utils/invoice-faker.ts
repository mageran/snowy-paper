import { InvoiceObject, InvoiceStatusValues } from "../../components/Invoice/invoice";
import { faker } from "@faker-js/faker";

export const createFakeInvoice = (): InvoiceObject => {
    const id = `INV-${faker.string.numeric(5)}`;
    const currency = 'USD';
    const value = faker.finance.amount({ min: 20, max: 9999.99 });
    let status = faker.helpers.arrayElement(InvoiceStatusValues);
    const customerName = faker.company.name();
    const notes = faker.lorem.words({ min: 3, max: 8 });
    let invoiceDate = faker.date.recent({ days: 180 });
    if (status === 'draft' || status === 'pendingApproval') {
        invoiceDate = faker.date.soon({ days: 5 })
    }
    const dueInDays = faker.helpers.arrayElement([45, 60, 90]);
    let dueDate = new Date(invoiceDate);
    dueDate.setDate(dueDate.getDate() + dueInDays);
    if (status !== 'draft' && status !== 'pendingApproval') {
        const today = new Date();
        if (today > dueDate && status !== 'paid') {
            status = 'pastDue';
        }
        if (today < dueDate && status !== 'paid') {
            status = 'awaitingPayment';
        }
        if (today.toLocaleDateString() === dueDate.toLocaleDateString() && status !== 'paid') {
            status = 'due';
        }
    }
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