import React, { createContext, useContext, useState } from "react";

const LocalStateContext = createContext();
const LocalStateProvider = LocalStateContext.Provider;

const SettingsProvider = ({ value, children }) => {
  // eslint-disable-next-line
  const [settings, updateSettings] = useState(value);

  return (
    <LocalStateProvider value={{ settings, updateSettings }}>
      {children}
    </LocalStateProvider>
  );
};

const useSettings = () => {
  return useContext(LocalStateContext);
};

export { SettingsProvider, useSettings };
