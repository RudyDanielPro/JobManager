import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Camera, Save, Mail, Briefcase, User as UserIcon, Loader2, Shield } from "lucide-react";
import { toast } from "sonner";
import { candidatosService } from "@/lib/candidatosService";
import { empresasService } from "@/lib/empresasService";
import { adminService } from "@/lib/adminService";

export default function Profile() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [apellido, setApellido] = useState("");
  const [empresaNombre, setEmpresaNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const isCandidate = currentUser?.rol?.toLowerCase() === "candidato";
  const isRecruiter = currentUser?.rol?.toLowerCase() === "recruiter";
  const isAdmin = currentUser?.rol?.toLowerCase() === "admin";

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
      return;
    }
    loadProfileData();
  }, [currentUser, navigate]);

  const loadProfileData = async () => {
    setLoading(true);
    try {
      if (isCandidate) {
        const data = await candidatosService.miPerfil();
        setName(data.nombre || "");
        setApellido(data.apellido || "");
        setAvatarPreview(data.fotoUrl || null);
      } else if (isRecruiter) {
        const data = await empresasService.miPerfil();
        setEmpresaNombre(data.nombreEmpresa || "");
        setDescripcion(data.descripcion || "");
        setUrl(data.url || "");
        setAvatarPreview(data.fotoUrl || null);
      } else if (isAdmin) {
        const adminData = await adminService.getAdminByUserId(currentUser.id);
        setName(adminData.nombre || "");
        setApellido(adminData.apellido || "");
        setAvatarPreview(currentUser.foto?.ruta || null);
      }
    } catch (error) {
      console.error("Error loading profile:", error);
      toast.error("Error al cargar el perfil");
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setAvatarPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      if (isCandidate && currentUser) {
        await candidatosService.actualizar(currentUser.id, {
          nombre: name,
          apellido: apellido,
        });
        
        if (selectedFile) {
          await candidatosService.actualizarFoto(currentUser.id, selectedFile);
        }
        
        toast.success("Perfil actualizado correctamente");
      } else if (isRecruiter && currentUser) {
        await empresasService.actualizar(currentUser.id, {
          nombreEmpresa: empresaNombre,
          descripcion: descripcion,
          url: url,
        });
        
        if (selectedFile) {
          await empresasService.actualizarLogo(currentUser.id, selectedFile);
        }
        
        toast.success("Perfil actualizado correctamente");
      } else if (isAdmin && currentUser) {
        await adminService.updateAdmin(currentUser.id, {
          nombre: name,
          apellido: apellido,
        });
        
        if (selectedFile) {
          await adminService.updateAdminFoto(currentUser.id, selectedFile);
        }
        
        toast.success("Perfil actualizado correctamente");
      }
      
      await loadProfileData();
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("Error al guardar los cambios");
    } finally {
      setSaving(false);
    }
  };

  if (!currentUser) return null;

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const getRoleIcon = () => {
    if (isAdmin) return <Shield className="h-3.5 w-3.5 text-primary" />;
    if (isRecruiter) return <Briefcase className="h-3.5 w-3.5 text-muted-foreground" />;
    return <Briefcase className="h-3.5 w-3.5 text-muted-foreground" />;
  };

  const getRoleLabel = () => {
    if (isAdmin) return "Administrador";
    if (isRecruiter) return "Reclutador";
    return "Candidato";
  };

  const getDisplayName = () => {
    if (isAdmin) return name || currentUser.usuario;
    if (isCandidate) return name ? `${name} ${apellido}` : currentUser.usuario;
    return empresaNombre || currentUser.usuario;
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-2xl font-bold text-foreground">Mi Perfil</h1>
      <p className="mt-1 text-sm text-muted-foreground">Gestiona tu información de cuenta</p>

      <form onSubmit={handleSave} className="mt-8 space-y-8">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
          <div className="relative">
            {avatarPreview ? (
              <img src={avatarPreview} alt="Avatar" className="h-24 w-24 rounded-full object-cover ring-4 ring-primary/10" />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground ring-4 ring-primary/10">
                {isAdmin 
                  ? (name ? name.charAt(0).toUpperCase() : currentUser.usuario?.charAt(0).toUpperCase() || "A")
                  : isCandidate 
                    ? (name ? name.charAt(0).toUpperCase() : <UserIcon className="h-10 w-10" />)
                    : (empresaNombre ? empresaNombre.charAt(0).toUpperCase() : <UserIcon className="h-10 w-10" />)
                }
              </div>
            )}
            <label className="absolute bottom-0 right-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md transition-colors hover:bg-primary/90">
              <Camera className="h-4 w-4" />
              <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
            </label>
          </div>
          <div className="text-center sm:text-left">
            <p className="text-lg font-semibold text-foreground">{getDisplayName()}</p>
            <div className="mt-1 flex items-center justify-center gap-1.5 sm:justify-start">
              {getRoleIcon()}
              <span className="text-sm text-muted-foreground">{getRoleLabel()}</span>
            </div>
          </div>
        </div>

        <div className="space-y-5 rounded-xl border border-border bg-card p-6 shadow-sm">
          {isCandidate ? (
            <>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Nombre</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Tu nombre"
                  className="flex h-11 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Apellido</label>
                <input
                  type="text"
                  value={apellido}
                  onChange={(e) => setApellido(e.target.value)}
                  placeholder="Tu apellido"
                  className="flex h-11 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </>
          ) : isRecruiter ? (
            <>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Nombre de la empresa</label>
                <input
                  type="text"
                  value={empresaNombre}
                  onChange={(e) => setEmpresaNombre(e.target.value)}
                  placeholder="Nombre de la empresa"
                  className="flex h-11 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Descripción</label>
                <textarea
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  placeholder="Describe tu empresa"
                  rows={4}
                  className="flex w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Sitio web</label>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://tusitio.com"
                  className="flex h-11 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </>
          ) : (
            <>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Nombre</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Tu nombre"
                  className="flex h-11 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Apellido</label>
                <input
                  type="text"
                  value={apellido}
                  onChange={(e) => setApellido(e.target.value)}
                  placeholder="Tu apellido"
                  className="flex h-11 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </>
          )}

          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-sm font-medium text-foreground">
              <Mail className="h-3.5 w-3.5 text-muted-foreground" /> Correo electrónico
            </label>
            <input
              type="email"
              value={currentUser.email}
              disabled
              className="flex h-11 w-full rounded-lg border border-border bg-muted px-3 text-sm text-muted-foreground cursor-not-allowed"
            />
            <p className="text-xs text-muted-foreground">El correo electrónico no se puede cambiar.</p>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 rounded-lg bg-primary px-8 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 active:scale-95 disabled:opacity-50"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {saving ? "Guardando..." : "Actualizar perfil"}
          </button>
        </div>
      </form>
    </div>
  );
}