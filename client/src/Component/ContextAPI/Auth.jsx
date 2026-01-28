// Component/ContextAPI/Auth.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import API from "../api";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await API.get("/api/user/me");
        setUser(res.data.user);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const logout = async () => {
    try {
      await API.post("/api/user/logout");
      setUser(null);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser,logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
