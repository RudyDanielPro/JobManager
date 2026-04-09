import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Briefcase, Lock, User, AlertCircle } from "lucide-react";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [identificador, setIdentificador] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!identificador || !password) {
      setError("Por favor, rellena todos los campos");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await login(identificador, password);

      if (result.success && result.user) {
        const userRole = result.user.rol?.toLowerCase();

       if (userRole === "admin") {
          navigate("/admin/dashboard", { replace: true });
        } else if (userRole === "recruiter") {
          navigate("/company/dashboard", { replace: true });
        } else if (userRole === "candidato") {
          navigate("/candidate/dashboard", { replace: true });
        } else {
          navigate("/", { replace: true });
        }
      } else {
        setError(result.error || "Credenciales incorrectas");
      }
    } catch (err: any) {
      console.error("Error en login:", err);
      setError(err.message || "Error al conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
            <Briefcase className="h-6 w-6 text-primary-foreground" />
          </div>
          <h1 className="mt-4 text-2xl font-bold text-foreground">Bienvenido a DevJobs</h1>
          <p className="mt-1 text-sm text-muted-foreground">Inicia sesión con tus credenciales</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          {error && (
            <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label htmlFor="identificador" className="text-sm font-medium text-foreground">
              Correo electrónico o usuario
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                id="identificador"
                type="text"
                value={identificador}
                onChange={(e) => setIdentificador(e.target.value)}
                placeholder="tu@correo.com o nombre_usuario"
                disabled={loading}
                autoComplete="username"
                className="flex h-11 w-full rounded-lg border border-border bg-card pl-10 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="password" className="text-sm font-medium text-foreground">
              Contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={loading}
                autoComplete="current-password"
                className="flex h-11 w-full rounded-lg border border-border bg-card pl-10 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full rounded-lg bg-primary py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Iniciando sesión..." : "Iniciar sesión"}
          </button>

          <p className="text-center text-sm text-muted-foreground">
            ¿No tienes cuenta?{" "}
            <Link to="/register" className="font-semibold text-primary hover:underline">
              Regístrate aquí
            </Link>
          </p>

          <p className="text-center text-xs text-muted-foreground border-t border-border pt-4 mt-4">
            <span className="font-semibold">Demo:</span> admin (reclutador) / candidato@mail.com (candidato) — contraseña: admin123
          </p>
        </form>
      </div>
    </div>
  );
}