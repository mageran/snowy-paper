import { InvoiceList } from "../components/Invoice/invoice";
import InvoiceTable from "../components/Invoice/InvoiceTable";

interface InvoicesPageProps {
    invoices: InvoiceList
}

function InvoicesPage({ invoices }: InvoicesPageProps) {
  return (
    <>
      <InvoiceTable entities={invoices}/>
    </>
  );
}

export default InvoicesPage