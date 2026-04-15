import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole: "RECRUITER" | "CANDIDATO" | "ADMIN";
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { isAuthenticated, currentUser } = useAuth();

  if (!isAuthenticated) {
    ("🔵 ProtectedRoute - No autenticado, redirigiendo a /login");
    return <Navigate to="/login" replace />;
  }

  // Convertir ambos roles a minúsculas para comparar correctamente
  const userRole = currentUser?.rol?.toLowerCase() || "";
  const requiredRoleLower = requiredRole.toLowerCase();


  if (userRole !== requiredRoleLower) {
    ("🔵 ProtectedRoute - Rol incorrecto, redirigiendo a /");
    return <Navigate to="/" replace />;
  }

  ("🔵 ProtectedRoute - Acceso permitido");
  return <>{children}</>;
}