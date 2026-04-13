import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { ofertasService, type OfertaResponse } from "@/lib/ofertasService";
import api from "@/lib/api";
import { 
  Plus, Briefcase, X, Loader2, Eye, Edit, Trash2, CheckCircle, XCircle, 
  MapPin, DollarSign, Calendar, Building2, Search, Filter, ChevronDown 
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default function CompanyDashboard() {
  const { currentUser, logout } = useAuth();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingOffer, setEditingOffer] = useState<OfertaResponse | null>(null);
  const [ofertas, setOfertas] = useState<OfertaResponse[]>([]);
  const [filteredOfertas, setFilteredOfertas] = useState<OfertaResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // Filtros y búsqueda
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive">("all");
  const [filterLocation, setFilterLocation] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);
  const [locations, setLocations] = useState<string[]>([]);
  
  const [newJob, setNewJob] = useState({ 
    titulo: "", 
    ubicacion: "", 
    rangoSalarial: "", 
    descripcion: "" 
  });

  const fetchOfertas = async () => {
    if (!currentUser) return;
    try {
      const response = await ofertasService.misOfertas(0, 100);
      setOfertas(response.content);
      
      const uniqueLocations = [...new Set(response.content.map(job => job.ubicacion).filter(Boolean))];
      setLocations(uniqueLocations as string[]);
      
      applyFilters(response.content, searchTerm, filterStatus, filterLocation);
    } catch (error) {
      console.error("Error cargando ofertas:", error);
      toast.error("Error al cargar tus ofertas");
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = (
    data: OfertaResponse[], 
    search: string, 
    status: "all" | "active" | "inactive",
    location: string
  ) => {
    let filtered = [...data];
    
    if (search.trim()) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        (job) =>
          job.titulo?.toLowerCase().includes(searchLower) ||
          job.nombreEmpresa?.toLowerCase().includes(searchLower) ||
          job.descripcion?.toLowerCase().includes(searchLower)
      );
    }
    
    if (status === "active") {
      filtered = filtered.filter((job) => job.estado === true);
    } else if (status === "inactive") {
      filtered = filtered.filter((job) => job.estado === false);
    }
    
    if (location !== "all" && location) {
      filtered = filtered.filter((job) => job.ubicacion === location);
    }
    
    setFilteredOfertas(filtered);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    applyFilters(ofertas, value, filterStatus, filterLocation);
  };

  const handleStatusFilter = (status: "all" | "active" | "inactive") => {
    setFilterStatus(status);
    applyFilters(ofertas, searchTerm, status, filterLocation);
  };

  const handleLocationFilter = (location: string) => {
    setFilterLocation(location);
    applyFilters(ofertas, searchTerm, filterStatus, location);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFilterStatus("all");
    setFilterLocation("all");
    setFilteredOfertas(ofertas);
  };

  useEffect(() => {
    fetchOfertas();
  }, [currentUser]);

  const ofertasActivas = ofertas.filter((o) => o.estado);
  const ofertasInactivas = ofertas.filter((o) => !o.estado);

  const handleCreateJob = async () => {
    if (!newJob.titulo || !newJob.ubicacion || !newJob.descripcion) {
      toast.error("Completa todos los campos obligatorios");
      return;
    }

    setSubmitting(true);
    try {
      await ofertasService.crear({
        titulo: newJob.titulo,
        descripcion: newJob.descripcion,
        ubicacion: newJob.ubicacion,
        rangoSalarial: newJob.rangoSalarial || "No especificado",
      });
      toast.success("Oferta creada correctamente");
      setShowCreateForm(false);
      setNewJob({ titulo: "", ubicacion: "", rangoSalarial: "", descripcion: "" });
      await fetchOfertas();
    } catch (error: any) {
      console.error("Error creando oferta:", error);
      toast.error(error.response?.data || "Error al crear la oferta");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateJob = async () => {
    if (!editingOffer) return;
    if (!newJob.titulo || !newJob.ubicacion || !newJob.descripcion) {
      toast.error("Completa todos los campos obligatorios");
      return;
    }

    setSubmitting(true);
    try {
      await ofertasService.actualizar(editingOffer.id, {
        titulo: newJob.titulo,
        descripcion: newJob.descripcion,
        ubicacion: newJob.ubicacion,
        rangoSalarial: newJob.rangoSalarial || "No especificado",
      });
      toast.success("Oferta actualizada correctamente");
      setShowEditForm(false);
      setEditingOffer(null);
      setNewJob({ titulo: "", ubicacion: "", rangoSalarial: "", descripcion: "" });
      await fetchOfertas();
    } catch (error: any) {
      console.error("Error actualizando oferta:", error);
      toast.error(error.response?.data || "Error al actualizar la oferta");
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (offer: OfertaResponse) => {
    const token = localStorage.getItem("token");
    
    if (!token) {
      toast.error("Sesión expirada. Por favor, inicia sesión nuevamente");
      logout();
      return;
    }
    
    try {
      if (offer.estado) {
        await ofertasService.desactivar(offer.id);
        toast.success("Oferta desactivada");
      } else {
        await ofertasService.activar(offer.id);
        toast.success("Oferta activada");
      }
      await fetchOfertas();
    } catch (error: any) {
      console.error("Error cambiando estado:", error);
      
      if (error.response?.status === 403) {
        toast.error("No tienes permisos para modificar esta oferta");
      } else if (error.response?.status === 401) {
        toast.error("Sesión expirada. Por favor, inicia sesión nuevamente");
        logout();
      } else {
        toast.error(error.response?.data || "Error al cambiar el estado");
      }
    }
  };

  const handleDeleteJob = async (offerId: number) => {
    if (!confirm("¿Estás seguro de que quieres eliminar esta oferta? Esta acción no se puede deshacer.")) return;
    
    try {
      await ofertasService.eliminar(offerId);
      toast.success("Oferta eliminada correctamente");
      await fetchOfertas();
    } catch (error: any) {
      console.error("Error eliminando oferta:", error);
      toast.error(error.response?.data || "Error al eliminar la oferta");
    }
  };

  const openEditModal = (offer: OfertaResponse) => {
    setEditingOffer(offer);
    setNewJob({
      titulo: offer.titulo,
      ubicacion: offer.ubicacion,
      rangoSalarial: offer.rangoSalarial || "",
      descripcion: offer.descripcion || "",
    });
    setShowEditForm(true);
  };

  const openCreateModal = () => {
    setNewJob({ titulo: "", ubicacion: "", rangoSalarial: "", descripcion: "" });
    setShowCreateForm(true);
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Cargando tus ofertas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Mis Ofertas</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Gestiona tus ofertas de empleo - {ofertas.length} oferta{ofertas.length !== 1 ? 's' : ''} publicada{ofertas.length !== 1 ? 's' : ''}
            </p>
          </div>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <Plus className="h-4 w-4" />
            Nueva oferta
          </button>
        </div>

        {/* Stats Cards */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="group relative overflow-hidden rounded-xl border border-border bg-card p-5 transition-all hover:shadow-md">
            <div className="absolute right-0 top-0 h-20 w-20 -translate-y-6 translate-x-6 rounded-full bg-primary/5 opacity-50 transition-all group-hover:scale-150" />
            <div className="relative flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10">
                <Briefcase className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{ofertas.length}</p>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Total ofertas</p>
              </div>
            </div>
          </div>
          <div className="group relative overflow-hidden rounded-xl border border-border bg-card p-5 transition-all hover:shadow-md">
            <div className="absolute right-0 top-0 h-20 w-20 -translate-y-6 translate-x-6 rounded-full bg-green-500/5 opacity-50 transition-all group-hover:scale-150" />
            <div className="relative flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-green-500/10">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">{ofertasActivas.length}</p>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Ofertas activas</p>
              </div>
            </div>
          </div>
          <div className="group relative overflow-hidden rounded-xl border border-border bg-card p-5 transition-all hover:shadow-md">
            <div className="absolute right-0 top-0 h-20 w-20 -translate-y-6 translate-x-6 rounded-full bg-gray-500/5 opacity-50 transition-all group-hover:scale-150" />
            <div className="relative flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-gray-500/10">
                <XCircle className="h-5 w-5 text-gray-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-600">{ofertasInactivas.length}</p>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Ofertas inactivas</p>
              </div>
            </div>
          </div>
        </div>

        {/* Barra de Búsqueda y Filtros */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar por título, empresa o descripción..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="h-10 w-full rounded-lg border border-border bg-background pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
            >
              <Filter className="h-4 w-4" />
              Filtros
              <ChevronDown className={`h-3 w-3 transition-transform ${showFilters ? "rotate-180" : ""}`} />
            </button>
            {(searchTerm || filterStatus !== "all" || filterLocation !== "all") && (
              <button
                onClick={clearFilters}
                className="inline-flex items-center justify-center rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary"
              >
                Limpiar filtros
              </button>
            )}
          </div>

          {showFilters && (
            <div className="rounded-lg border border-border bg-card p-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Estado</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleStatusFilter("all")}
                      className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                        filterStatus === "all"
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                      }`}
                    >
                      Todos
                    </button>
                    <button
                      onClick={() => handleStatusFilter("active")}
                      className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                        filterStatus === "active"
                          ? "bg-green-600 text-white"
                          : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                      }`}
                    >
                      Activas
                    </button>
                    <button
                      onClick={() => handleStatusFilter("inactive")}
                      className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                        filterStatus === "inactive"
                          ? "bg-gray-600 text-white"
                          : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                      }`}
                    >
                      Inactivas
                    </button>
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Ubicación</label>
                  <select
                    value={filterLocation}
                    onChange={(e) => handleLocationFilter(e.target.value)}
                    className="h-9 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none"
                  >
                    <option value="all">Todas las ubicaciones</option>
                    {locations.map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">
            Listado de ofertas
            {filteredOfertas.length !== ofertas.length && (
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                ({filteredOfertas.length} de {ofertas.length})
              </span>
            )}
          </h2>
          <span className="text-xs text-muted-foreground">
            Última actualización: {format(new Date(), "dd/MM/yyyy HH:mm")}
          </span>
        </div>
        
        <div className="space-y-4">
          {filteredOfertas.length === 0 ? (
            <div className="rounded-xl border border-border bg-card p-12 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Briefcase className="h-8 w-8 text-primary" />
              </div>
              <p className="text-muted-foreground">
                {searchTerm || filterStatus !== "all" || filterLocation !== "all"
                  ? "No se encontraron ofertas con los filtros aplicados."
                  : "Aún no has publicado ninguna oferta."}
              </p>
              {(searchTerm || filterStatus !== "all" || filterLocation !== "all") ? (
                <button
                  onClick={clearFilters}
                  className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                >
                  Limpiar filtros
                </button>
              ) : (
                <button
                  onClick={openCreateModal}
                  className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Crear mi primera oferta
                </button>
              )}
            </div>
          ) : (
            filteredOfertas.map((job) => (
              <div
                key={job.id}
                className="group rounded-xl border border-border bg-card p-5 transition-all hover:shadow-md hover:border-primary/20"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 text-lg font-bold text-primary">
                      {job.nombreEmpresa?.charAt(0) || "E"}
                    </div>
                    <div className="min-w-0 flex-1">
                      <Link 
                        to={`/jobs/${job.id}`} 
                        className="text-lg font-semibold text-foreground transition-colors hover:text-primary"
                      >
                        {job.titulo}
                      </Link>
                      <div className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                        <Building2 className="h-3.5 w-3.5" />
                        <span>{job.nombreEmpresa}</span>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {job.ubicacion || "Remoto"}
                        </span>
                        <span className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3" />
                          {job.rangoSalarial || "No especificado"}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {job.fechaCreacion ? format(new Date(job.fechaCreacion), "dd/MM/yyyy", { locale: es }) : "Reciente"}
                        </span>
                      </div>
                      {job.descripcion && (
                        <p className="mt-2 text-xs text-muted-foreground line-clamp-2">
                          {job.descripcion.substring(0, 120)}...
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <button
                      onClick={() => handleToggleStatus(job)}
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-all ${
                        job.estado
                          ? "bg-green-100 text-green-700 hover:bg-green-200"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {job.estado ? (
                        <CheckCircle className="h-3 w-3" />
                      ) : (
                        <XCircle className="h-3 w-3" />
                      )}
                      {job.estado ? "Activa" : "Inactiva"}
                    </button>
                    <div className="flex gap-1">
                      <button
                        onClick={() => openEditModal(job)}
                        className="rounded-lg p-2 text-blue-600 transition-all hover:bg-blue-50"
                        title="Editar oferta"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <Link
                        to={`/jobs/${job.id}`}
                        className="rounded-lg p-2 text-gray-600 transition-all hover:bg-gray-50"
                        title="Ver oferta"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => handleDeleteJob(job.id)}
                        className="rounded-lg p-2 text-red-600 transition-all hover:bg-red-50"
                        title="Eliminar oferta"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal de Crear Oferta - mantener igual */}
        {showCreateForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setShowCreateForm(false)}>
            <div className="w-full max-w-2xl rounded-2xl border border-border bg-card p-6 shadow-xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between border-b border-border pb-4">
                <h2 className="text-xl font-semibold text-foreground">Crear nueva oferta</h2>
                <button onClick={() => setShowCreateForm(false)} className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary">
                  <X className="h-4 w-4" />
                </button>
              </div>
              
              <div className="mt-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Título del puesto *</label>
                  <input
                    type="text"
                    placeholder="Ej: Desarrollador Full Stack"
                    value={newJob.titulo}
                    onChange={(e) => setNewJob({ ...newJob, titulo: e.target.value })}
                    className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Ubicación *</label>
                  <input
                    type="text"
                    placeholder="Ej: Remoto, Madrid, Barcelona"
                    value={newJob.ubicacion}
                    onChange={(e) => setNewJob({ ...newJob, ubicacion: e.target.value })}
                    className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Rango salarial</label>
                  <input
                    type="text"
                    placeholder="Ej: 35.000€ - 45.000€"
                    value={newJob.rangoSalarial}
                    onChange={(e) => setNewJob({ ...newJob, rangoSalarial: e.target.value })}
                    className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Descripción del puesto *</label>
                  <textarea
                    placeholder="Describe las responsabilidades, requisitos y beneficios del puesto..."
                    value={newJob.descripcion}
                    onChange={(e) => setNewJob({ ...newJob, descripcion: e.target.value })}
                    rows={6}
                    className="w-full resize-none rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <p className="mt-1 text-xs text-muted-foreground text-right">
                    {newJob.descripcion.length} caracteres
                  </p>
                </div>
              </div>

              <div className="mt-6 flex gap-3 pt-4 border-t border-border">
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="flex-1 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground hover:bg-secondary"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleCreateJob}
                  disabled={submitting || !newJob.titulo || !newJob.ubicacion || !newJob.descripcion}
                  className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? "Publicando..." : "Publicar oferta"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Editar Oferta */}
        {showEditForm && editingOffer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setShowEditForm(false)}>
            <div className="w-full max-w-2xl rounded-2xl border border-border bg-card p-6 shadow-xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between border-b border-border pb-4">
                <h2 className="text-xl font-semibold text-foreground">Editar oferta</h2>
                <button onClick={() => setShowEditForm(false)} className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary">
                  <X className="h-4 w-4" />
                </button>
              </div>
              
              <div className="mt-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Título del puesto *</label>
                  <input
                    type="text"
                    placeholder="Ej: Desarrollador Full Stack"
                    value={newJob.titulo}
                    onChange={(e) => setNewJob({ ...newJob, titulo: e.target.value })}
                    className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Ubicación *</label>
                  <input
                    type="text"
                    placeholder="Ej: Remoto, Madrid, Barcelona"
                    value={newJob.ubicacion}
                    onChange={(e) => setNewJob({ ...newJob, ubicacion: e.target.value })}
                    className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Rango salarial</label>
                  <input
                    type="text"
                    placeholder="Ej: 35.000€ - 45.000€"
                    value={newJob.rangoSalarial}
                    onChange={(e) => setNewJob({ ...newJob, rangoSalarial: e.target.value })}
                    className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Descripción del puesto *</label>
                  <textarea
                    placeholder="Describe las responsabilidades, requisitos y beneficios del puesto..."
                    value={newJob.descripcion}
                    onChange={(e) => setNewJob({ ...newJob, descripcion: e.target.value })}
                    rows={6}
                    className="w-full resize-none rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <p className="mt-1 text-xs text-muted-foreground text-right">
                    {newJob.descripcion.length} caracteres
                  </p>
                </div>
              </div>

              <div className="mt-6 flex gap-3 pt-4 border-t border-border">
                <button
                  onClick={() => setShowEditForm(false)}
                  className="flex-1 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground hover:bg-secondary"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleUpdateJob}
                  disabled={submitting || !newJob.titulo || !newJob.ubicacion || !newJob.descripcion}
                  className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? "Actualizando..." : "Actualizar oferta"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}