import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const AuthContext = createContext(null);

function getStoredAuth() {
  return {
    token: localStorage.getItem("token"),
    role: localStorage.getItem("role"),
    userEmail: localStorage.getItem("userEmail"),
  };
}

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [authState, setAuthState] = useState(getStoredAuth);

  async function login(credentials) {
    const response = await api.post("/auth/login", credentials);
    const nextAuth = {
      token: response.data.access_token,
      role: response.data.role,
      userEmail: credentials.email,
    };

    localStorage.setItem("token", nextAuth.token);
    localStorage.setItem("role", nextAuth.role);
    localStorage.setItem("userEmail", nextAuth.userEmail);
    setAuthState(nextAuth);
    navigate("/dashboard", { replace: true });

    return response.data;
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userEmail");
    setAuthState({
      token: null,
      role: null,
      userEmail: null,
    });
    navigate("/login", { replace: true });
  }

  const value = {
    ...authState,
    isAuthenticated: Boolean(authState.token),
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
