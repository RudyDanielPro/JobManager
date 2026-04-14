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

    console.log("🔵 AuthProvider - Cargando sesión guardada");
    console.log("🔵 Token existe:", !!token);
    console.log("🔵 User guardado:", savedUser);

    if (savedUser && token) {
      try {
        const user = JSON.parse(savedUser) as LoginResponse;
        console.log("🔵 Usuario recuperado del localStorage:", user);
        console.log("🔵 Rol del usuario recuperado:", user.rol);
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
    console.log("🔵 AuthContext.login - Iniciando login para:", identificador);
    
    try {
      const user = await authService.login({ identificador, password });
      
      console.log("🔵 AuthContext.login - Usuario recibido del servicio:", user);
      console.log("🔵 AuthContext.login - Rol del usuario:", user?.rol);
      console.log("🔵 AuthContext.login - Email:", user?.email);
      console.log("🔵 AuthContext.login - ID:", user?.id);
      
      if (user) {
        setCurrentUser(user);
        setIsAuthenticated(true);
        console.log("🔵 AuthContext.login - Login exitoso, usuario guardado");
        return { success: true, user };
      }
      console.log("🔵 AuthContext.login - No se recibió usuario");
      return { success: false, error: "No se pudo obtener la información del usuario" };
    } catch (error: any) {
      console.error("🔴 AuthContext.login - Error:", error);
      
      let errorMessage = "Error al conectar con el servidor";
      
      if (error.response) {
        console.log("🔴 Status code:", error.response.status);
        console.log("🔴 Response data:", error.response.data);
        
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
    console.log("🔵 AuthContext.logout - Cerrando sesión");
    authService.logout(); 
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  const updateProfile = (data: Partial<LoginResponse>) => {
    if (!currentUser) return;
    
    const updated = { ...currentUser, ...data };
    setCurrentUser(updated);
    localStorage.setItem("user", JSON.stringify(updated));
    console.log("🔵 AuthContext.updateProfile - Perfil actualizado:", updated);
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