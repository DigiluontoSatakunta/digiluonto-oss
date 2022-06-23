import React, { createContext, useContext, useState } from "react";

const LocalStateContext = createContext();
const LocalStateProvider = LocalStateContext.Provider;

const LocationProvider = ({ value, children }) => {
  // eslint-disable-next-line
  const [location, updateLocation] = useState(value);

  return (
    <LocalStateProvider value={{ location, updateLocation }}>
      {children}
    </LocalStateProvider>
  );
};

const useLocation = () => {
  return useContext(LocalStateContext);
};

export { LocationProvider, useLocation };
