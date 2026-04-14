import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { postulacionesService } from "@/lib/postulacionesService";
import { ofertasService } from "@/lib/ofertasService";
import { FileText, ExternalLink, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import type { PostulacionResponse } from "@/lib/postulacionesService";

// ✅ Interfaz extendida para incluir fotoUrl
interface PostulacionConFoto extends PostulacionResponse {
  fotoUrl?: string | null;
}

export default function CandidateDashboard() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [postulaciones, setPostulaciones] = useState<PostulacionConFoto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPostulaciones = async () => {
      if (!currentUser) return;
      try {
        const response = await postulacionesService.misPostulaciones(0, 100);
        
        // ✅ Obtener la foto de cada oferta
        const postulacionesConFoto = await Promise.all(
          response.content.map(async (post) => {
            try {
              const oferta = await ofertasService.obtenerPublica(post.ofertaId);
              return { ...post, fotoUrl: oferta.fotoUrl };
            } catch (error) {
              console.error(`Error obteniendo oferta ${post.ofertaId}:`, error);
              return { ...post, fotoUrl: null };
            }
          })
        );
        
        setPostulaciones(postulacionesConFoto);
      } catch (error) {
        console.error("Error cargando postulaciones:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPostulaciones();
  }, [currentUser]);

  const postulacionesActivas = postulaciones.filter((p) => p.estado);
  const postulacionesPendientes = postulaciones.filter((p) => !p.estado);

  const statusStyles: Record<string, string> = {
    aceptada: "bg-green-100 text-green-700",
    pendiente: "bg-yellow-100 text-yellow-700",
  };

  const statusLabels: Record<string, string> = {
    aceptada: "Aceptada",
    pendiente: "Pendiente",
  };

  const handlePostulacionClick = (ofertaId: number) => {
    if (ofertaId) {
      navigate(`/jobs/${ofertaId}`);
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
      <div>
        <h1 className="text-2xl font-bold text-foreground">Mis Aplicaciones</h1>
        <p className="mt-1 text-sm text-muted-foreground">Revisa el estado de tus postulaciones</p>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-2xl font-bold text-foreground">{postulaciones.length}</p>
          <p className="text-sm text-muted-foreground">Total postulaciones</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-2xl font-bold text-green-600">{postulacionesActivas.length}</p>
          <p className="text-sm text-muted-foreground">Aceptadas</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-2xl font-bold text-yellow-600">{postulacionesPendientes.length}</p>
          <p className="text-sm text-muted-foreground">Pendientes</p>
        </div>
      </div>

      <div className="mt-8 space-y-3">
        {postulaciones.length === 0 ? (
          <div className="rounded-xl border border-border bg-card p-12 text-center">
            <FileText className="mx-auto h-10 w-10 text-muted-foreground" />
            <p className="mt-3 text-muted-foreground">Aún no has aplicado a ninguna oferta.</p>
            <Link to="/jobs" className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
              Explorar ofertas <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </div>
        ) : (
          postulaciones.map((post) => {
            const statusKey = post.estado ? "aceptada" : "pendiente";
            return (
              <div
                key={post.id}
                onClick={() => handlePostulacionClick(post.ofertaId)}
                className="block cursor-pointer"
              >
                <div className="card-hover flex flex-col gap-3 rounded-xl border border-border bg-card p-5 sm:flex-row sm:items-center sm:justify-between transition-all hover:shadow-md hover:border-primary/20">
                  <div className="flex items-center gap-4">
                    {/* ✅ Logo de la empresa con foto */}
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 overflow-hidden">
                      {post.fotoUrl ? (
                        <img 
                          src={post.fotoUrl} 
                          alt={post.nombreEmpresa || "Empresa"}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                            if (fallback) fallback.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <span 
                        className={`text-sm font-bold text-primary ${post.fotoUrl ? 'hidden' : 'flex'} items-center justify-center w-full h-full`}
                      >
                        {post.nombreEmpresa?.charAt(0) || "E"}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{post.tituloOferta}</p>
                      <p className="text-sm text-muted-foreground">
                        {post.nombreEmpresa} · Aplicado el{" "}
                        {format(new Date(post.fechaPostulacion), "dd/MM/yyyy", { locale: es })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[statusKey]}`}>
                      {statusLabels[statusKey]}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}