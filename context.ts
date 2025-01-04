import React, { createContext, useContext } from "react";

const UserContext = createContext<any>(null);

export const useUserData = () => useContext(UserContext);

export default UserContext;
