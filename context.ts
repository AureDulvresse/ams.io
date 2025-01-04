import React, { createContext, useContext } from "react";

const AppContext = createContext<any>(null);

export const useContextData = () => useContext(AppContext);

export default AppContext;
