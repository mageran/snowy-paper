import { configureStore } from "@reduxjs/toolkit";
import "./App.css";
import { InvoiceList } from "./components/Invoice/invoice";
import { createRootReducer, serializeMiddleware } from "./lib/redux/reducer";
import InvoicesPage from "./pages/InvoicesPage";
import { Provider } from "react-redux";
import { AppSettingsProvider } from "./lib/AppSettingsContext"; // Import AppSettingsProvider
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"; // Import react-router components
import DemoModeSwitch from "./lib/demo-utils/DemoModeSwitch";

export const InvoicesSliceName = "invoices";

function App() {
  const invoices = new InvoiceList(InvoicesSliceName);

  // initialize redux:
  const rootReducer = createRootReducer([invoices]);
  const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(serializeMiddleware),
  });

  return (
    <Provider store={store}>
      <AppSettingsProvider>
        <DemoModeSwitch/>
        <Router>
          <Routes>
            <Route path="/" element={<Navigate to="/invoices" replace />} />
            <Route path="/invoices" element={<InvoicesPage invoices={invoices} />} />
          </Routes>
        </Router>
      </AppSettingsProvider>
    </Provider>
  );
}

export default App;
