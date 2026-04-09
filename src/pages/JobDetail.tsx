import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { ArrowLeft, MapPin, DollarSign, Clock, Building2, Loader2 } from "lucide-react";
import { ofertasService, type OfertaResponse } from "@/lib/ofertasService";
import { postulacionesService } from "@/lib/postulacionesService";
import { useAuth } from "@/context/AuthContext";
import ApplyModal from "@/components/ApplyModal";
import { toast } from "sonner";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default function JobDetail() {
  const { id } = useParams<{ id: string }>();
  const { currentUser } = useAuth();

  const [job, setJob] = useState<OfertaResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [checkingApplication, setCheckingApplication] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchJob = async () => {
      try {
        const data = await ofertasService.obtenerPublica(parseInt(id));
        setJob(data);

        // Verificar si ya aplicó (si está autenticado y es candidato)
        if (currentUser && currentUser.rol?.toLowerCase() === "candidato") {
          await checkIfApplied(parseInt(id));
        }
      } catch (error) {
        console.error("Error cargando oferta:", error);
        toast.error("No se pudo cargar la oferta");
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id, currentUser]);

  const checkIfApplied = async (ofertaId: number) => {
    setCheckingApplication(true);
    try {
      const response = await postulacionesService.misPostulaciones(0, 100);
      const yaAplico = response.content.some(p => p.ofertaId === ofertaId);
      setHasApplied(yaAplico);
    } catch (error) {
      console.error("Error verificando aplicación:", error);
    } finally {
      setCheckingApplication(false);
    }
  };

  const handleApply = async (coverLetter: string, file: File) => {
    if (!currentUser || !job) return;

    try {
      await postulacionesService.enviar({
        ofertaId: job.id,
        mensaje: coverLetter,
        cv: file,
      });
      setShowApplyModal(false);
      setHasApplied(true);
      toast.success("Aplicación enviada correctamente", {
        description: "Tu CV ha sido enviado a la empresa.",
      });
    } catch (error: any) {
      console.error("Error al enviar postulación:", error);
      toast.error(error.response?.data || "Error al enviar la aplicación");
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 text-center">
        <p className="text-muted-foreground">Oferta no encontrada.</p>
        <Link to="/jobs" className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
          <ArrowLeft className="h-3.5 w-3.5" /> Volver a ofertas
        </Link>
      </div>
    );
  }

  const fechaPublicacion = job.fechaCreacion
    ? format(new Date(job.fechaCreacion), "dd 'de' MMMM 'de' yyyy", { locale: es })
    : 'Reciente';

  const isCandidate = currentUser?.rol?.toLowerCase() === "candidato";
  const isRecruiter = currentUser?.rol?.toLowerCase() === "recruiter";

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <Link to="/jobs" className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-3.5 w-3.5" /> Volver a ofertas
      </Link>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Columna principal - Detalles de la oferta */}
        <div className="lg:col-span-2 animate-fade-in">
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-lg font-bold text-primary">
                {job.nombreEmpresa?.charAt(0) || "E"}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">{job.titulo}</h1>
                <p className="mt-0.5 text-muted-foreground">{job.nombreEmpresa || "Empresa Confidencial"}</p>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5 rounded-lg bg-secondary px-3 py-1.5">
                <MapPin className="h-3.5 w-3.5" /> {job.ubicacion || 'Remoto'}
              </span>
              <span className="flex items-center gap-1.5 rounded-lg bg-secondary px-3 py-1.5">
                <DollarSign className="h-3.5 w-3.5" /> {job.rangoSalarial || 'No especificado'}
              </span>
              <span className="flex items-center gap-1.5 rounded-lg bg-secondary px-3 py-1.5">
                <Clock className="h-3.5 w-3.5" /> {fechaPublicacion}
              </span>
            </div>

            <div className="mt-6 border-t border-border pt-6">
              <h2 className="text-lg font-semibold text-foreground">Descripción del puesto</h2>
              <p className="mt-3 leading-relaxed text-muted-foreground whitespace-pre-wrap">{job.descripcion}</p>
            </div>
          </div>
        </div>

        {/* Columna lateral - Info empresa y botón aplicar */}
        <div className="animate-fade-in">
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 font-bold text-primary text-sm">
                {job.nombreEmpresa?.charAt(0) || "E"}
              </div>
              <div>
                <p className="font-semibold text-foreground">{job.nombreEmpresa || "Empresa Confidencial"}</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Building2 className="h-3 w-3" /> Empresa verificada
                </p>
              </div>
            </div>

            <div className="mt-6">
              {isCandidate ? (
                checkingApplication ? (
                  <div className="flex items-center justify-center py-3">
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                  </div>
                ) : hasApplied ? (
                  <div className="rounded-lg bg-success/10 px-4 py-3 text-center text-sm font-medium text-success">
                    ✓ Ya has aplicado a esta oferta
                  </div>
                ) : (
                  <button
                    onClick={() => setShowApplyModal(true)}
                    className="w-full rounded-lg bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                  >
                    Aplicar ahora
                  </button>
                )
              ) : isRecruiter ? (
                <div className="rounded-lg bg-secondary/50 px-4 py-3 text-center text-sm text-muted-foreground">
                  Eres reclutador. No puedes aplicar a ofertas.
                </div>
              ) : (
                <Link
                  to="/login"
                  className="block w-full rounded-lg bg-primary px-4 py-3 text-center text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  Inicia sesión para aplicar
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {showApplyModal && job && (
        <ApplyModal
          jobTitle={job.titulo}
          companyName={job.nombreEmpresa || "Empresa Confidencial"}
          onClose={() => setShowApplyModal(false)}
          onSubmit={handleApply}
        />
      )}
    </div>
  );
}