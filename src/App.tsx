import { configureStore } from "@reduxjs/toolkit";
import "./App.css";
import { InvoiceList } from "./components/Invoice/invoice";
import { createRootReducer } from "./lib/redux/reducer";
import InvoicesPage from "./pages/InvoicesPage";
import { Provider } from "react-redux";

export const InvoicesSliceName = "invoices";

function App() {
  const invoices = new InvoiceList(InvoicesSliceName);

  // initialize redux:
  const rootReducer = createRootReducer([invoices]);
  const store = configureStore({ reducer: rootReducer });

  return (
    <Provider store={store}>
      <InvoicesPage invoices={invoices}/>
    </Provider>
  );
}

export default App;
