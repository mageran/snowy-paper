import React, { createContext, useContext, useState, ReactNode } from "react";

interface AppSettingsContextProps {
  isDemoMode: boolean;
  setIsDemoMode: (value: boolean) => void;
}

const AppSettingsContext = createContext<AppSettingsContextProps | undefined>(undefined);

export const AppSettingsProvider = ({ children }: { children: ReactNode }) => {
  const [isDemoMode, setIsDemoMode] = useState(false);

  return (
    <AppSettingsContext.Provider value={{ isDemoMode, setIsDemoMode }}>
      {children}
    </AppSettingsContext.Provider>
  );
};

export const useAppSettings = (): AppSettingsContextProps => {
  const context = useContext(AppSettingsContext);
  if (!context) {
    throw new Error("useAppSettings must be used within an AppSettingsProvider");
  }
  return context;
};