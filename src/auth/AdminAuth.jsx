import { createContext, useContext, useEffect, useState } from "react";
import { api, setAccessToken } from "../api/client";

const AdminAuthContext = createContext(null);

export const AdminAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.auth.refresh()
      .then(({ user: refreshedUser, accessToken }) => {
        setAccessToken(accessToken);
        setUser(refreshedUser);
      })
      .catch(() => setAccessToken(null))
      .finally(() => setLoading(false));
  }, []);

  const login = async (credentials) => {
    const response = await api.auth.login(credentials);
    setAccessToken(response.accessToken);
    setUser(response.user);
    return response.user;
  };

  const logout = async () => {
    try {
      await api.auth.logout();
    } finally {
      setAccessToken(null);
      setUser(null);
    }
  };

  return (
    <AdminAuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) throw new Error("useAdminAuth must be used inside AdminAuthProvider.");
  return context;
};