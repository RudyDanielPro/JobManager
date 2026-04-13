import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, User, Briefcase, LayoutDashboard, AlertCircle, CheckCircle, Bell, Shield, Building2, Globe } from "lucide-react";
import { authService } from "@/lib/authService";
import type { RegisterData } from "@/lib/authService";
import { toast } from "sonner";

type UserRole = "reclutador" | "candidato";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    usuario: "",
    email: "",
    password: "",
    confirmPassword: "",
    url: "",
  });
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const update = (field: string, value: string) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.email.endsWith("@gmail.com")) {
      setError("El correo debe ser de Gmail");
      return;
    }
    
    // Validaciones según el rol
    if (selectedRole === "candidato") {
      if (!form.nombre || !form.apellido || !form.usuario || !form.email || !form.password || !form.confirmPassword) {
        setError("Por favor, rellena todos los campos");
        return;
      }
    } else if (selectedRole === "reclutador") {
      if (!form.nombre || !form.usuario || !form.email || !form.password || !form.confirmPassword || !form.url) {
        setError("Por favor, rellena todos los campos");
        return;
      }
    } else {
      setError("Por favor, selecciona un rol");
      return;
    }
    
    if (form.password !== form.confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const userData: RegisterData = {
        nombre: form.nombre,
        apellido: selectedRole === "candidato" ? form.apellido : "",
        usuario: form.usuario,
        email: form.email,
        password: form.password,
        rol: selectedRole,
      };
      
      if (selectedRole === "reclutador") {
        userData.nombreEmpresa = form.nombre;
        userData.descripcion = "";
        userData.url = form.url;
      }
      
      await authService.register(userData, selectedFile || undefined);
      
      toast.success("¡Registro exitoso! Redirigiendo al login...");
      navigate("/login");
    } catch (err: any) {
      console.error("Error completo:", err);
      const errorMessage = err.response?.data || err.message || "Error al registrar usuario";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <div className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center bg-primary/5 px-12">
        <div className="max-w-md space-y-8">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary">
            <Briefcase className="h-8 w-8 text-primary-foreground" />
          </div>
          <h2 className="text-3xl font-bold text-foreground">Bienvenido a DevJobs</h2>
          <div className="space-y-6">
            <div className="flex items-start gap-4 rounded-xl border border-primary/20 bg-card p-5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Usa tu correo de Gmail</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Por favor asegúrate de que tu correo sea de Gmail. Ahí te llegarán todas las notificaciones.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 rounded-xl border border-border bg-card p-5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Bell className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Notificaciones en tiempo real</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Recibirás alertas sobre nuevas ofertas y cambios en tus aplicaciones.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 rounded-xl border border-border bg-card p-5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Datos seguros</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Tu información está protegida y nunca se compartirá sin tu consentimiento.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex w-full items-center justify-center px-4 py-8 lg:w-1/2">
        <div className="w-full max-w-md animate-fade-in">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground">Crear cuenta</h1>
            <p className="mt-1 text-sm text-muted-foreground">Completa tus datos para registrarte</p>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {error && (
              <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="lg:hidden rounded-xl border border-primary/20 bg-primary/5 p-4 mb-2">
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">Usa tu correo de Gmail.</span> Ahí te llegarán las notificaciones.
                </p>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Foto de perfil</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={loading}
                className="flex h-11 w-full rounded-lg border border-border bg-card px-3 text-sm text-foreground file:mr-3 file:rounded-lg file:border-0 file:bg-primary/10 file:px-3 file:py-1 file:text-sm file:font-medium file:text-primary focus:border-primary focus:outline-none disabled:opacity-50"
              />
            </div>

            {/* Campo Nombre / Nombre de la empresa - DINÁMICO según rol */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">
                {selectedRole === "reclutador" ? "Nombre de la empresa *" : "Nombre *"}
              </label>
              <div className="relative">
                {selectedRole === "reclutador" ? (
                  <Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                ) : (
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                )}
                <input
                  type="text"
                  value={form.nombre}
                  onChange={(e) => update("nombre", e.target.value)}
                  placeholder={selectedRole === "reclutador" ? "Nombre de tu empresa" : "Tu nombre"}
                  disabled={loading}
                  className="flex h-11 w-full rounded-lg border border-border bg-card pl-10 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
                />
              </div>
            </div>

            {/* Campo Apellido - SOLO para candidatos */}
            {selectedRole === "candidato" && (
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Apellido *</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    value={form.apellido}
                    onChange={(e) => update("apellido", e.target.value)}
                    placeholder="Tu apellido"
                    disabled={loading}
                    className="flex h-11 w-full rounded-lg border border-border bg-card pl-10 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
                  />
                </div>
              </div>
            )}

            {/* Campo URL - SOLO para reclutadores */}
            {selectedRole === "reclutador" && (
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Sitio web *</label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="url"
                    value={form.url}
                    onChange={(e) => update("url", e.target.value)}
                    placeholder="https://tuempresa.com"
                    disabled={loading}
                    className="flex h-11 w-full rounded-lg border border-border bg-card pl-10 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Usuario *</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  value={form.usuario}
                  onChange={(e) => update("usuario", e.target.value)}
                  placeholder="Nombre de usuario"
                  disabled={loading}
                  className="flex h-11 w-full rounded-lg border border-border bg-card pl-10 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Correo electrónico *</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  placeholder="tu@gmail.com"
                  disabled={loading}
                  className="flex h-11 w-full rounded-lg border border-border bg-card pl-10 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Contraseña *</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="password"
                    value={form.password}
                    onChange={(e) => update("password", e.target.value)}
                    placeholder="••••••••"
                    disabled={loading}
                    className="flex h-11 w-full rounded-lg border border-border bg-card pl-10 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Confirmar *</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="password"
                    value={form.confirmPassword}
                    onChange={(e) => update("confirmPassword", e.target.value)}
                    placeholder="••••••••"
                    disabled={loading}
                    className="flex h-11 w-full rounded-lg border border-border bg-card pl-10 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <label className="text-sm font-medium text-foreground">Selecciona tu rol *</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedRole("reclutador");
                    setForm(prev => ({ ...prev, apellido: "" }));
                  }}
                  disabled={loading}
                  className={`flex items-center gap-3 rounded-xl border p-4 text-left transition-all ${
                    selectedRole === "reclutador"
                      ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                      : "border-border bg-card hover:border-primary/30"
                  } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                    selectedRole === "reclutador" ? "bg-primary/20" : "bg-primary/10"
                  }`}>
                    <LayoutDashboard className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">Reclutador</p>
                    <p className="text-xs text-muted-foreground">Publica ofertas</p>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedRole("candidato");
                    setForm(prev => ({ ...prev, url: "" }));
                  }}
                  disabled={loading}
                  className={`flex items-center gap-3 rounded-xl border p-4 text-left transition-all ${
                    selectedRole === "candidato"
                      ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                      : "border-border bg-card hover:border-primary/30"
                  } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                    selectedRole === "candidato" ? "bg-primary/20" : "bg-primary/10"
                  }`}>
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">Candidato</p>
                    <p className="text-xs text-muted-foreground">Busca empleo</p>
                  </div>
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full rounded-lg bg-primary py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Registrando..." : "Crear cuenta"}
            </button>

            <p className="text-center text-sm text-muted-foreground">
              ¿Ya tienes cuenta?{" "}
              <Link to="/login" className="font-semibold text-primary hover:underline">
                Inicia sesión
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}