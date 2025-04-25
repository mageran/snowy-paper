import { Button, StackLayout } from "@salt-ds/core";
import { InvoiceList, InvoiceObject } from "../components/Invoice/invoice";
import InvoiceTable from "../components/Invoice/InvoiceTable";
import withDialog from "../components/utilities/withDialog";
import InvoiceForm from "../components/Invoice/InvoiceForm";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../lib/redux/redux";
import { createFakeInvoice } from "../lib/demo-utils/invoice-faker";
import InvoiceStatusCardsContainer from "../components/Invoice/InvoiceStatusCardsContainer";
import { useAppSettings } from "../lib/AppSettingsContext";

interface InvoicesPageProps {
    invoices: InvoiceList
}


const InvoicesPage = ({ invoices }: InvoicesPageProps) => {

    const dispatch = useDispatch<AppDispatch>();
    const { add } = invoices.slice.actions;
    const { isDemoMode } = useAppSettings();

    const createNewInvoice = (data: Record<string, any>) => {
        console.log('creating a new invoice using %o', data);
        const invObj = InvoiceObject.createInvoiceFromRecord(data);
        console.log('invoiceObject: %o', invObj);
        dispatch(add(invObj.toJson()))
    }

    const InvoiceDialog = withDialog(InvoiceForm)

    const ActionBar = () => {
        return (
            <StackLayout direction="row">
                <InvoiceDialog
                    entities={invoices}
                    openButtonLabel="Enter New Invoice"
                    title="New Invoice"
                    cancelButtonLabel="Cancel"
                    onSave={createNewInvoice}
                    createSampleData={createFakeInvoice}
                />
                {isDemoMode && (
                    <Button
                        appearance="transparent"
                        onClick={() => {
                            const numSamples = 50;
                            for (let i = 0; i < numSamples; i++) {
                                setTimeout(() => {
                                    createNewInvoice(createFakeInvoice());
                                }, i*100)
                            }
                        }}
                    >Generate Sample Data</Button>
                )}
            </StackLayout>
        );
    }


    return (
        <>
            <StackLayout direction="column" align="start">
                <InvoiceStatusCardsContainer entities={invoices} />
                <ActionBar />
                <InvoiceTable entities={invoices} />
            </StackLayout>
        </>
    );
}

export default InvoicesPage