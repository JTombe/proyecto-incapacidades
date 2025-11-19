
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { setAuthToken, getAuthToken } from "../service/authentication";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  // State to hold the authentication token
  const [token, setToken_] = useState(getAuthToken());

  // Function to set the authentication token
  const setToken = (newToken) => {
    setToken_(newToken);
    setAuthToken(newToken);
  };

  useEffect(() => {
    setAuthToken(token);
  }, [token]);

  // Memoized value of the authentication context
  const contextValue = useMemo(
    () => ({
      token,
      setToken,
    }),
    [token]
  );

  // Provide the authentication context to the children components
  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export { AuthProvider, AuthContext };
export default AuthProvider;