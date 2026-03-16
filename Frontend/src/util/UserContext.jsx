import React, { useState, useEffect, createContext, useContext } from "react";

const UserContext = createContext();

const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userInfoString = localStorage.getItem("userInfo");
    if (userInfoString) {
      try {
        const userInfo = JSON.parse(userInfoString);
        setUser(userInfo);
      } catch (error) {
        console.error("Error parsing userInfo:", error);
      }
    }
  }, []);

  return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>;
};

const useUser = () => {
  return useContext(UserContext);
};

export { UserContextProvider, useUser };
