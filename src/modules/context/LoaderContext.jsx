import React, { createContext, useState } from "react";
const IsLoadingContext = createContext();

const IsLoadingContextProvider = ({ children }) => {
  const [isLoadingContextUpdated, setIsLoadingContextUpdated] = useState(false);

  return (
    <IsLoadingContext.Provider
      value={{ isLoadingContextUpdated, setIsLoadingContextUpdated }}>
      {children}
    </IsLoadingContext.Provider>
  );
};

export { IsLoadingContext, IsLoadingContextProvider };
