import React, {createContext, useContext, useState} from "react";

const LocalStateContext = createContext();
const LocalStateProvider = LocalStateContext.Provider;

const UserLocation = ({value, children}) => {
  // eslint-disable-next-line
  const [userLocation, updateUserLocation] = useState(null);

  return (
    <LocalStateProvider value={{userLocation, updateUserLocation}}>
      {children}
    </LocalStateProvider>
  );
};

const useUserLocation = () => {
  return useContext(LocalStateContext);
};

export {UserLocation, useUserLocation};
