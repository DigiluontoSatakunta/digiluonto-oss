import {createContext, useContext, useState} from "react";

const LocalStateContext = createContext();
const LocalStateProvider = LocalStateContext.Provider;

function LoaderProvider({children}) {
  // This is our own custom provider! We will store data (state)
  // and functionality (updaters) in here and anyone can access it via the consumer!
  const [loader, updateLoader] = useState(false);

  return (
    <LocalStateProvider
      value={{
        loader,
        updateLoader,
      }}
    >
      {children}
    </LocalStateProvider>
  );
}

// make a custom hook for accessing the cart local state
function useLoader() {
  // We use a consumer here to access the local state
  const all = useContext(LocalStateContext);
  return all;
}

export {LoaderProvider, useLoader};
