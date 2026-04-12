import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole: "RECRUITER" | "CANDIDATO" | "ADMIN";
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { isAuthenticated, currentUser } = useAuth();

  console.log("🔵 ProtectedRoute - isAuthenticated:", isAuthenticated);
  console.log("🔵 ProtectedRoute - currentUser:", currentUser);
  console.log("🔵 ProtectedRoute - requiredRole:", requiredRole);
  console.log("🔵 ProtectedRoute - user rol:", currentUser?.rol);

  if (!isAuthenticated) {
    console.log("🔵 ProtectedRoute - No autenticado, redirigiendo a /login");
    return <Navigate to="/login" replace />;
  }

  // Convertir ambos roles a minúsculas para comparar correctamente
  const userRole = currentUser?.rol?.toLowerCase() || "";
  const requiredRoleLower = requiredRole.toLowerCase();
  
  console.log("🔵 ProtectedRoute - userRole lower:", userRole);
  console.log("🔵 ProtectedRoute - requiredRole lower:", requiredRoleLower);
  console.log("🔵 ProtectedRoute - coinciden?:", userRole === requiredRoleLower);

  if (userRole !== requiredRoleLower) {
    console.log("🔵 ProtectedRoute - Rol incorrecto, redirigiendo a /");
    return <Navigate to="/" replace />;
  }

  console.log("🔵 ProtectedRoute - Acceso permitido");
  return <>{children}</>;
}