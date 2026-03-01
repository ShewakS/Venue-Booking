import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import api, { authTokenKey } from "../services/api";

const AuthContext = createContext(null);
const STORAGE_KEY = "scsb_auth";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setIsAuthReady(true);
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  const login = async ({ email, password }) => {
    const response = await api.post("/auth/login", { email, password });
    const payload = response?.data?.data || {};

    if (payload.token) {
      localStorage.setItem(authTokenKey, payload.token);
    }

    if (payload.user) {
      setUser(payload.user);
    }

    return payload.user;
  };

  const register = async ({ name, email, password, role }) => {
    const response = await api.post("/auth/register", { name, email, password, role });
    const payload = response?.data?.data || {};

    if (payload.token) {
      localStorage.setItem(authTokenKey, payload.token);
    }

    if (payload.user) {
      setUser(payload.user);
    }

    return payload.user;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(authTokenKey);
  };

  const value = useMemo(
    () => ({
      user,
      role: user?.role || null,
      isAuthenticated: Boolean(user),
      isAuthReady,
      login,
      register,
      logout,
    }),
    [isAuthReady, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
