import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const AuthContext = createContext(null);

function getStoredAuth() {
  return {
    token: localStorage.getItem("token"),
    user: null,
  };
}

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [authState, setAuthState] = useState(getStoredAuth);
  const [isLoading, setIsLoading] = useState(Boolean(getStoredAuth().token));

  async function loadCurrentUser() {
    const response = await api.get("/users/me");

    setAuthState((current) => ({
      ...current,
      user: response.data,
    }));

    return response.data;
  }

  useEffect(() => {
    if (!authState.token) {
      setIsLoading(false);
      return;
    }

    let isMounted = true;

    async function restoreSession() {
      try {
        const user = await api.get("/users/me");

        if (!isMounted) {
          return;
        }

        setAuthState((current) => ({
          ...current,
          user: user.data,
        }));
      } catch (error) {
        if (isMounted) {
          localStorage.removeItem("token");
          setAuthState({
            token: null,
            user: null,
          });
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    restoreSession();

    return () => {
      isMounted = false;
    };
  }, [authState.token]);

  async function login(credentials) {
    const response = await api.post("/auth/login", credentials);
    const nextAuth = {
      token: response.data.access_token,
      user: null,
    };

    localStorage.setItem("token", nextAuth.token);
    setAuthState(nextAuth);
    setIsLoading(true);

    const currentUser = await loadCurrentUser();

    navigate("/dashboard", { replace: true });

    return currentUser;
  }

  function logout() {
    localStorage.removeItem("token");
    setAuthState({
      token: null,
      user: null,
    });
    setIsLoading(false);
    navigate("/login", { replace: true });
  }

  const value = {
    token: authState.token,
    user: authState.user,
    role: authState.user?.role ?? null,
    isAuthenticated: Boolean(authState.token),
    isLoading,
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
