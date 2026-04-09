import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { ofertasService, type OfertaResponse } from "@/lib/ofertasService";
import { Plus, Briefcase, Users, X, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

export default function CompanyDashboard() {
  const { currentUser } = useAuth();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [ofertas, setOfertas] = useState<OfertaResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [newJob, setNewJob] = useState({ 
    titulo: "", 
    ubicacion: "", 
    rangoSalarial: "", 
    descripcion: "" 
  });

  useEffect(() => {
    const fetchOfertas = async () => {
      if (!currentUser) return;
      try {
        const response = await ofertasService.misOfertas(0, 100);
        setOfertas(response.content);
      } catch (error) {
        console.error("Error cargando ofertas:", error);
        toast.error("Error al cargar tus ofertas");
      } finally {
        setLoading(false);
      }
    };
    fetchOfertas();
  }, [currentUser]);

  const ofertasActivas = ofertas.filter((o) => o.estado);

  const handleCreateJob = async () => {
    if (!newJob.titulo || !newJob.ubicacion) {
      toast.error("Completa los campos obligatorios");
      return;
    }

    try {
      await ofertasService.crear({
        titulo: newJob.titulo,
        descripcion: newJob.descripcion,
        ubicacion: newJob.ubicacion,
        rangoSalarial: newJob.rangoSalarial,
      });
      toast.success("Oferta creada correctamente");
      setShowCreateForm(false);
      setNewJob({ titulo: "", ubicacion: "", rangoSalarial: "", descripcion: "" });
      const response = await ofertasService.misOfertas(0, 100);
      setOfertas(response.content);
    } catch (error) {
      console.error("Error creando oferta:", error);
      toast.error("Error al crear la oferta");
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Panel de Reclutador</h1>
          <p className="mt-1 text-sm text-muted-foreground">Gestiona tus ofertas de empleo</p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          Nueva oferta
        </button>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Briefcase className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{ofertas.length}</p>
              <p className="text-sm text-muted-foreground">Ofertas publicadas</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">0</p>
              <p className="text-sm text-muted-foreground">Total aplicaciones</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
              <Briefcase className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{ofertasActivas.length}</p>
              <p className="text-sm text-muted-foreground">Ofertas activas</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold text-foreground mb-4">Tus ofertas</h2>
        <div className="space-y-3">
          {ofertas.length === 0 ? (
            <div className="rounded-xl border border-border bg-card p-12 text-center">
              <Briefcase className="mx-auto h-10 w-10 text-muted-foreground" />
              <p className="mt-3 text-muted-foreground">Aún no has publicado ninguna oferta.</p>
            </div>
          ) : (
            ofertas.map((job) => (
              <Link key={job.id} to={`/jobs/${job.id}`} className="block">
                <div className="card-hover flex flex-col items-start justify-between rounded-xl border border-border bg-card p-5 sm:flex-row sm:items-center">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold text-primary">
                      {job.nombreEmpresa?.charAt(0) || "E"}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{job.titulo}</p>
                      <p className="text-sm text-muted-foreground">{job.nombreEmpresa} · {job.ubicacion}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mt-3 sm:mt-0">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      job.estado ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                    }`}>
                      {job.estado ? "Activa" : "Inactiva"}
                    </span>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>

      {showCreateForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-sm p-4" onClick={() => setShowCreateForm(false)}>
          <div className="w-full max-w-lg animate-fade-in rounded-2xl border border-border bg-card p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Crear nueva oferta</h2>
              <button onClick={() => setShowCreateForm(false)} className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-4 space-y-3">
              <input
                type="text"
                placeholder="Título del puesto *"
                value={newJob.titulo}
                onChange={(e) => setNewJob({ ...newJob, titulo: e.target.value })}
                className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <input
                type="text"
                placeholder="Ubicación *"
                value={newJob.ubicacion}
                onChange={(e) => setNewJob({ ...newJob, ubicacion: e.target.value })}
                className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <input
                type="text"
                placeholder="Rango salarial (ej. 40.000€ - 55.000€)"
                value={newJob.rangoSalarial}
                onChange={(e) => setNewJob({ ...newJob, rangoSalarial: e.target.value })}
                className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <textarea
                placeholder="Descripción del puesto"
                value={newJob.descripcion}
                onChange={(e) => setNewJob({ ...newJob, descripcion: e.target.value })}
                className="h-28 w-full resize-none rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div className="mt-5 flex gap-3">
              <button onClick={() => setShowCreateForm(false)} className="flex-1 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground hover:bg-secondary">
                Cancelar
              </button>
              <button
                onClick={handleCreateJob}
                disabled={!newJob.titulo || !newJob.ubicacion}
                className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Publicar oferta
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}