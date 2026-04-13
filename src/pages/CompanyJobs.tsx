// pages/CompanyJobs.tsx
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Search, Loader2, Briefcase, MapPin, DollarSign, Clock, Building2, Filter, ChevronDown } from "lucide-react";
import { ofertasService, type OfertaResponse } from "@/lib/ofertasService";
import JobCard from "@/components/JobCard";
import Pagination from "@/components/Pagination";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const ITEMS_PER_PAGE = 6;

// Función para extraer el salario mínimo de un rango
const extractMinSalary = (salaryRange: string): number => {
  if (!salaryRange || salaryRange === "No especificado") return 0;
  
  // Intentar extraer números del string
  const numbers = salaryRange.match(/\d+/g);
  if (!numbers || numbers.length === 0) return 0;
  
  // Tomar el primer número como salario mínimo
  return parseInt(numbers[0], 10);
};

// Función para clasificar el salario en rangos
const getSalaryRange = (salary: number): string => {
  if (salary === 0) return "no-especificado";
  if (salary < 500) return "0-500";
  if (salary >= 500 && salary < 1000) return "500-1000";
  if (salary >= 1000 && salary < 5000) return "1000-5000";
  if (salary >= 5000 && salary < 10000) return "5000-10000";
  if (salary >= 10000 && salary < 20000) return "10000-20000";
  if (salary >= 20000 && salary < 30000) return "20000-30000";
  if (salary >= 30000 && salary < 50000) return "30000-50000";
  if (salary >= 50000 && salary < 70000) return "50000-70000";
  return "70000+";
};

export default function CompanyJobs() {
  const { currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [ofertas, setOfertas] = useState<OfertaResponse[]>([]);
  const [filteredOfertas, setFilteredOfertas] = useState<OfertaResponse[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);
  
  // Filtros
  const [showFilters, setShowFilters] = useState(false);
  const [filterLocation, setFilterLocation] = useState<string>("all");
  const [locations, setLocations] = useState<string[]>([]);
  const [filterSalary, setFilterSalary] = useState<string>("all");

  useEffect(() => {
    const fetchOfertas = async () => {
      setLoading(true);
      try {
        const pageToFetch = currentPage - 1;
        
        // Obtener TODAS las ofertas activas de todas las empresas
        let response;
        if (searchTerm) {
          response = await ofertasService.buscar(searchTerm, undefined, pageToFetch, ITEMS_PER_PAGE);
        } else {
          response = await ofertasService.listarActivas(pageToFetch, ITEMS_PER_PAGE);
        }
        
        setOfertas(response.content);
        setFilteredOfertas(response.content);
        setTotalPages(response.totalPages);
        setTotalElements(response.totalElements);
        
        // Extraer ubicaciones únicas
        const uniqueLocations = [...new Set(response.content.map(job => job.ubicacion).filter(Boolean))];
        setLocations(uniqueLocations as string[]);
        
      } catch (error) {
        console.error("Error cargando ofertas:", error);
        toast.error("Error al cargar las ofertas");
      } finally {
        setLoading(false);
      }
    };

    fetchOfertas();
  }, [currentPage, searchTerm]);

  // Aplicar filtros adicionales
  useEffect(() => {
    let filtered = [...ofertas];
    
    // Filtro por ubicación
    if (filterLocation !== "all") {
      filtered = filtered.filter((job) => job.ubicacion === filterLocation);
    }
    
    // Filtro por rango salarial - CORREGIDO con los mismos rangos que Jobs.tsx
    if (filterSalary !== "all") {
      filtered = filtered.filter((job) => {
        const minSalary = extractMinSalary(job.rangoSalarial || "");
        const salaryRange = getSalaryRange(minSalary);
        return salaryRange === filterSalary;
      });
    }
    
    setFilteredOfertas(filtered);
  }, [filterLocation, filterSalary, ofertas]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearFilters = () => {
    setFilterLocation("all");
    setFilterSalary("all");
    setSearchTerm("");
    setCurrentPage(1);
  };

  const hasActiveFilters = filterLocation !== "all" || filterSalary !== "all" || searchTerm !== "";

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">Ofertas de empleo</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {loading ? "Cargando..." : `${totalElements} ofertas disponibles en el mercado`}
              </p>
            </div>
            <Link
              to="/company/dashboard"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow-md"
            >
              ← Volver a Mis Ofertas
            </Link>
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
                className="h-11 w-full rounded-xl border border-border bg-background pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
                showFilters || hasActiveFilters
                  ? "bg-primary text-primary-foreground"
                  : "border border-input bg-card text-foreground hover:bg-secondary"
              }`}
            >
              <Filter className="h-4 w-4" />
              Filtros
              <ChevronDown className={`h-3 w-3 transition-transform ${showFilters ? "rotate-180" : ""}`} />
            </button>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="inline-flex items-center justify-center gap-1 rounded-xl border border-input bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
              >
                Limpiar filtros
              </button>
            )}
          </div>

          {/* Panel de Filtros */}
          {showFilters && (
            <div className="rounded-xl border border-border bg-card p-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">Ubicación</label>
                  <select
                    value={filterLocation}
                    onChange={(e) => setFilterLocation(e.target.value)}
                    className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none"
                  >
                    <option value="all">Todas las ubicaciones</option>
                    {locations.map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">Salario mínimo anual</label>
                  <select
                    value={filterSalary}
                    onChange={(e) => setFilterSalary(e.target.value)}
                    className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none"
                  >
                    <option value="all">Todos los salarios</option>
                    <option value="0-500">Menos de 500</option>
                    <option value="500-1000">500 - 1.000</option>
                    <option value="1000-5000">1.000 - 5.000</option>
                    <option value="5000-10000">5.000 - 10.000</option>
                    <option value="10000-20000">10.000 - 20.000</option>
                    <option value="20000-30000">20.000 - 30.000</option>
                    <option value="30000-50000">30.000 - 50.000</option>
                    <option value="50000-70000">50.000 - 70.000</option>
                    <option value="70000+">Más de 70.000</option>
                  </select>
                  <p className="mt-1 text-xs text-muted-foreground">
                    *Basado en el salario mínimo del rango publicado
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Contador de resultados */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Mostrando {filteredOfertas.length} de {totalElements} ofertas
          </p>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-sm text-primary hover:underline"
            >
              Limpiar todos los filtros
            </button>
          )}
        </div>

        {/* Lista de ofertas */}
        <div className="space-y-4">
          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <div className="text-center">
                <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-4" />
                <p className="text-muted-foreground">Cargando ofertas...</p>
              </div>
            </div>
          ) : filteredOfertas.length > 0 ? (
            filteredOfertas.map((job) => <JobCard key={job.id} job={job} />)
          ) : (
            <div className="rounded-xl border border-border bg-card p-12 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Briefcase className="h-8 w-8 text-primary" />
              </div>
              <p className="text-muted-foreground">
                {hasActiveFilters
                  ? "No se encontraron ofertas con los filtros aplicados."
                  : "No hay ofertas disponibles en este momento."}
              </p>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                >
                  Limpiar filtros
                </button>
              )}
            </div>
          )}
        </div>

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="mt-8">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </div>
  );
}