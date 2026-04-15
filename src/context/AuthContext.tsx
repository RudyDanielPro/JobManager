import { createContext, useContext, useState, useEffect } from "react";
import { authService } from "@/lib/authService";
import type { LoginResponse } from "@/lib/types";

interface AuthContextType {
  currentUser: LoginResponse | null;
  isAuthenticated: boolean;
  login: (identificador: string, password: string) => Promise<{ success: boolean; user?: LoginResponse; error?: string }>;
  logout: () => void;
  updateProfile: (data: Partial<LoginResponse>) => void;
  setIsAuthenticated: (value: boolean) => void;
  setCurrentUser: (user: LoginResponse | null) => void; // ✅ AÑADIR ESTA LÍNEA
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<LoginResponse | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");


    if (savedUser && token) {
      try {
        const user = JSON.parse(savedUser) as LoginResponse;
        setCurrentUser(user);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Error al recuperar sesión:", error);
        authService.logout();
      }
    }
    setLoading(false);
  }, []);

  const login = async (identificador: string, password: string) => {
    
    try {
      const user = await authService.login({ identificador, password });
      
      if (user) {
        setCurrentUser(user);
        setIsAuthenticated(true);
        ("🔵 AuthContext.login - Login exitoso, usuario guardado");
        return { success: true, user };
      }
      ("🔵 AuthContext.login - No se recibió usuario");
      return { success: false, error: "No se pudo obtener la información del usuario" };
    } catch (error: any) {
      console.error("🔴 AuthContext.login - Error:", error);
      
      let errorMessage = "Error al conectar con el servidor";
      
      if (error.response) {
        
        
        if (error.response.status === 401) {
          errorMessage = "Usuario o contraseña incorrectos";
        } else if (error.response.status === 403) {
          errorMessage = "Acceso denegado. No tienes permisos.";
        } else {
          errorMessage = error.response.data?.message || "Error en el servidor";
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      return { success: false, error: errorMessage };
    }
  };

  const logout = () => {
    authService.logout(); 
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  const updateProfile = (data: Partial<LoginResponse>) => {
    if (!currentUser) return;
    
    const updated = { ...currentUser, ...data };
    setCurrentUser(updated);
    localStorage.setItem("user", JSON.stringify(updated));
  };

  const value = {
    currentUser,
    isAuthenticated,
    login,
    logout,
    updateProfile,
    setIsAuthenticated,
    setCurrentUser, // ✅ AÑADIR ESTA LÍNEA
  };

  if (loading) {
    return null;
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
};