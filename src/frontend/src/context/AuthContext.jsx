
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { setAuthToken, getAuthToken, logoutService, getUserFromToken } from "../service/authentication";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  // State to hold the authentication token
  const [token, setToken_] = useState(getAuthToken());
  const [user, setUser] = useState(null);
  const [roles, setRoles] = useState(null);

  // Function to set the authentication token
  const setToken = (newToken) => {
    setToken_(newToken);
    setAuthToken(newToken);

    if (newToken) {
      const parsed = getUserFromToken(newToken);
      setUser(parsed?.user || null);
      setRoles(parsed?.roles || null);
    } else {
      setUser(null);
      setRoles(null);
    }
  };

  useEffect(() => {
    setAuthToken(token);
    // initialize user/roles from existing token on mount
    if (token) {
      const parsed = getUserFromToken(token);
      setUser(parsed?.user || null);
      setRoles(parsed?.roles || null);
    }
  }, [token]);

  // Memoized value of the authentication context
  const contextValue = useMemo(
    () => ({
      token,
      setToken,
      user,
      roles,
      isAuthenticated: !!token,
      hasRole: (r) => {
        if (!roles) return false;
        return Array.isArray(roles) ? roles.includes(r) : roles === r;
      },
      logout: () => {
        setToken_(null);
        setUser(null);
        setRoles(null);
        logoutService();
      },
    }),
    [token, user, roles]
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