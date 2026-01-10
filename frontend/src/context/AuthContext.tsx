import { createContext, useState, useContext, useEffect } from "react";
import { authService } from "../services/auth.service";
import type { User } from "../services/auth.service";

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    
    if (storedToken && storedUser) {
        try {
          // Verify token is still valid by fetching current user
          // This will also check if email is verified (backend returns 403 if not verified)
          const response = await authService.getMe();
          
          // Double-check email is verified (extra safety - backend should have already checked)
          if (response.user && response.user.emailVerified !== true) {
            // Email not verified - clear storage and force re-authentication
            throw new Error('Email not verified');
          }
          
          setUser(response.user);
      setToken(storedToken);
        } catch (error: any) {
          // Token is invalid or email not verified - clear storage
          console.log('Auth initialization failed:', error.response?.data?.error?.message || error.message);
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setUser(null);
          setToken(null);
        }
    }
    setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login({ email, password });
      
      if (response.user && response.token) {
        setUser(response.user);
        setToken(response.token);
        localStorage.setItem("token", response.token);
        localStorage.setItem("user", JSON.stringify(response.user));
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.error?.message || error.message || "Login failed. Please try again.";
      throw new Error(errorMessage);
    }
  };

  const register = async (name: string, email: string, password: string): Promise<void> => {
    try {
      await authService.register({ name, email, password });
      // Registration successful - user will need to verify email before login
      // No need to set user/token here
    } catch (error: any) {
      const errorMessage = error.response?.data?.error?.message || error.message || "Registration failed. Please try again.";
      throw new Error(errorMessage);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}