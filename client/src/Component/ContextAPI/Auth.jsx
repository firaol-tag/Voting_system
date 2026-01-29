import React, { createContext, useContext, useEffect, useState } from "react";
import API from "../api";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔁 Restore session on refresh
  useEffect(() => {
    const restoreUser = async () => {
      try {
        const res = await API.get("/api/user/me");
        if (res.data?.success) {
          setUser(res.data.data);
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    restoreUser();
  }, []);

  const login = async ({ email, password }) => {
    const res = await API.post("/api/user/login", { email, password });
    setUser(res.data.data);
  };

  const logout = async (e) => {
    await API.post("/api/user/logout");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, loading, setLoading, setUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}
