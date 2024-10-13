import { createContext, useContext, useState } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import { URLS } from "../config";

export type AuthContextType = {
  isLoggedIn: boolean;
  isLoading: boolean;
  token: string;
  logout: () => void;
  login: (username: string, password: string) => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

const { Provider } = AuthContext;

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useLocalStorage("token", "");
  const [loading, setLoading] = useState(false);

  const logout = () => {
    setToken("");
  };

  const login = async (username: string, password: string) => {
    setLoading(true);
    try {
      const response = await fetch(URLS.login, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) return;
      const data = await response.json();

      setToken(data);
    } catch (error) {
      console.error("Login failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Provider
      value={{
        isLoading: loading,
        isLoggedIn: !!token,
        token,
        logout,
        login,
      }}
    >
      {children}
    </Provider>
  );
};

const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within a AuthProvider");
  }
  return context;
};

export { useAuthContext, AuthProvider };
