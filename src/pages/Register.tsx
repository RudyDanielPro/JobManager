import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UserRole, users } from "@/data/mockData";
import { useAuth } from "@/context/AuthContext";
import { Mail, Lock, User, Phone, MapPin, Briefcase, LayoutDashboard, AlertCircle, CheckCircle, Bell, Shield } from "lucide-react";

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    location: "",
  });
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const update = (field: string, value: string) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      setError("Completa todos los campos obligatorios");
      return;
    }
    if (!selectedRole) {
      setError("Selecciona un rol para continuar");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }
    if (form.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }
    if (users.find((u) => u.email === form.email)) {
      setError("Ya existe una cuenta con ese correo electrónico");
      return;
    }

    const newUser = {
      id: `u${users.length + 1}`,
      name: form.name,
      email: form.email,
      password: form.password,
      role: selectedRole,
      avatar: form.name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2),
      phone: form.phone || undefined,
      location: form.location || undefined,
      bio: "",
    };

    users.push(newUser);
    setSuccess(true);

    setTimeout(() => {
      login(form.email, form.password, selectedRole);
      navigate(selectedRole === "RECRUITER" ? "/company/dashboard" : "/candidate/dashboard");
    }, 1500);
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <div className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center bg-primary/5 px-12">
        <div className="max-w-md space-y-8">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary">
            <Briefcase className="h-8 w-8 text-primary-foreground" />
          </div>
          <h2 className="text-3xl font-bold text-foreground">
            Bienvenido a DevJobs
          </h2>
          <div className="space-y-6">
            <div className="flex items-start gap-4 rounded-xl border border-primary/20 bg-card p-5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Usa tu correo de Gmail</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Por favor asegúrese de que su correo sea el correo de Gmail. Ahí le llegarán todas las notificaciones de la plataforma.
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
                  Recibirás alertas sobre nuevas ofertas, cambios de estado en tus aplicaciones y mensajes de reclutadores.
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
                  Tu información personal está protegida y nunca será compartida sin tu consentimiento.
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

          {success ? (
            <div className="mt-8 flex flex-col items-center gap-3 rounded-xl border border-primary/20 bg-primary/5 p-8 text-center">
              <CheckCircle className="h-12 w-12 text-primary" />
              <p className="text-lg font-semibold text-foreground">¡Registro exitoso!</p>
              <p className="text-sm text-muted-foreground">Redirigiendo a tu panel...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              {error && (
                <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {error}
                </div>
              )}

              <div className="lg:hidden rounded-xl border border-primary/20 bg-primary/5 p-4 mb-2">
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">Usa tu correo de Gmail.</span> Ahí le llegarán todas las notificaciones de la plataforma.
                  </p>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Nombre completo *</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => update("name", e.target.value)}
                    placeholder="Tu nombre completo"
                    className="flex h-11 w-full rounded-lg border border-border bg-card pl-10 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
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
                    className="flex h-11 w-full rounded-lg border border-border bg-card pl-10 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
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
                      className="flex h-11 w-full rounded-lg border border-border bg-card pl-10 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
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
                      className="flex h-11 w-full rounded-lg border border-border bg-card pl-10 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Teléfono</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => update("phone", e.target.value)}
                      placeholder="+34 600 000 000"
                      className="flex h-11 w-full rounded-lg border border-border bg-card pl-10 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Ubicación</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="text"
                      value={form.location}
                      onChange={(e) => update("location", e.target.value)}
                      placeholder="Madrid, España"
                      className="flex h-11 w-full rounded-lg border border-border bg-card pl-10 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <label className="text-sm font-medium text-foreground">Selecciona tu rol *</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedRole("RECRUITER")}
                    className={`flex items-center gap-3 rounded-xl border p-4 text-left transition-all ${
                      selectedRole === "RECRUITER"
                        ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                        : "border-border bg-card hover:border-primary/30"
                    }`}
                  >
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                      selectedRole === "RECRUITER" ? "bg-primary/20" : "bg-primary/10"
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
                    onClick={() => setSelectedRole("CANDIDATE")}
                    className={`flex items-center gap-3 rounded-xl border p-4 text-left transition-all ${
                      selectedRole === "CANDIDATE"
                        ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                        : "border-border bg-card hover:border-primary/30"
                    }`}
                  >
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                      selectedRole === "CANDIDATE" ? "bg-primary/20" : "bg-primary/10"
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
                className="mt-2 w-full rounded-lg bg-primary py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Crear cuenta
              </button>

              <p className="text-center text-sm text-muted-foreground">
                ¿Ya tienes cuenta?{" "}
                <Link to="/login" className="font-semibold text-primary hover:underline">
                  Inicia sesión
                </Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
