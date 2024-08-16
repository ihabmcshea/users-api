"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { IUser } from "app/interfaces/IUser";

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | undefined;
  user: IUser | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [token, setToken] = useState<string | undefined>(undefined);
  const [user, setUser] = useState<IUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

  // Check authentication status on initial load
  useEffect(() => {
    const initAuth = () => {
      const storedToken = localStorage.getItem("token")?.trim();
      const storedUser = localStorage.getItem("user");
      console.log(`Authorization: Bearer ${storedToken}`);

      if (storedToken && storedUser) {
        setIsAuthenticated(true);
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  // Refresh token and handle authentication status
  useEffect(() => {
    const refreshToken = async () => {
      if (!token) return;

      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/v1/auth/refresh-token`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const newToken = response.data.token;
        localStorage.setItem("token", newToken);
        setToken(newToken);
      } catch (error) {
        console.error("Token refresh failed", error);
        // handleLogout();
      }
    };

    const checkAuthStatus = async () => {
      if (!token) return;
      // const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/v1/auth/refresh-token`, {


      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/v1/auth/check-auth `, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.data.refreshRequired) {
          await refreshToken();
        }
      } catch (error) {
        // handleLogout();
      }
    };

    checkAuthStatus();
  }, [token]);

  // Login function
  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/v1/auth/login`,
        { email, password }
      );
      const { access_token, user } = response.data;

      setIsAuthenticated(true);
      setToken(access_token);
      setUser(user);
      localStorage.setItem("token", access_token);
      localStorage.setItem("user", JSON.stringify(user));
      router.push("/");
    } catch (error) {
      if (error.response?.data?.email) {
        throw new Error(error.response.data.email);
      } else {
        throw new Error("There was a problem logging you in.");
      }
    }
  };

  // Logout function
  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/");
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, token, user, isLoading, login, logout }}
    >
      {isLoading ? <p>Loading...</p> : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
