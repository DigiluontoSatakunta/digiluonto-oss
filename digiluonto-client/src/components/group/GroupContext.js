import React, { createContext, useContext, useState } from "react";

const LocalStateContext = createContext();
const LocalStateProvider = LocalStateContext.Provider;

const GroupProvider = ({ value, children }) => {
  // eslint-disable-next-line
  const [group, setGroup] = useState(value);

  return <LocalStateProvider value={group}>{children}</LocalStateProvider>;
};

const useGroup = () => {
  return useContext(LocalStateContext);
};

export { GroupProvider, useGroup };
