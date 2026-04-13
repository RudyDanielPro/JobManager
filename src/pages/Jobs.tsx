import { useState, useEffect } from "react";
import { Search, Loader2, Filter, ChevronDown, X } from "lucide-react";
import { ofertasService, type OfertaResponse } from "@/lib/ofertasService";
import JobCard from "@/components/JobCard";
import Pagination from "@/components/Pagination";
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

export default function Jobs() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [ofertas, setOfertas] = useState<OfertaResponse[]>([]);
  const [filteredOfertas, setFilteredOfertas] = useState<OfertaResponse[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);
  
  // Estados para filtros
  const [showFilters, setShowFilters] = useState(false);
  const [filterLocation, setFilterLocation] = useState<string>("all");
  const [filterSalary, setFilterSalary] = useState<string>("all");
  const [locations, setLocations] = useState<string[]>([]);

  useEffect(() => {
    const fetchOfertas = async () => {
      setLoading(true);
      try {
        const pageToFetch = currentPage - 1;
        
        let response;
        if (search) {
          response = await ofertasService.buscar(search, undefined, pageToFetch, ITEMS_PER_PAGE);
        } else {
          response = await ofertasService.listarActivas(pageToFetch, ITEMS_PER_PAGE);
        }
        
        setOfertas(response.content);
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
  }, [currentPage, search]);

  // Aplicar filtros adicionales
  useEffect(() => {
    let filtered = [...ofertas];
    
    // Filtro por ubicación
    if (filterLocation !== "all") {
      filtered = filtered.filter((job) => job.ubicacion === filterLocation);
    }
    
    // Filtro por rango salarial
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
    setSearch(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearFilters = () => {
    setFilterLocation("all");
    setFilterSalary("all");
  };

  const hasActiveFilters = filterLocation !== "all" || filterSalary !== "all";

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Ofertas de empleo</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {loading ? "Cargando..." : `${totalElements} ofertas disponibles`}
        </p>
      </div>

      {/* Barra de búsqueda y botón de filtros */}
      <div className="flex flex-col gap-3 sm:flex-row mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar por título, empresa o ubicación..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="h-11 w-full rounded-xl border border-input bg-card pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
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
            <X className="h-3 w-3" />
            Limpiar filtros
          </button>
        )}
      </div>

      {/* Panel de filtros */}
      {showFilters && (
        <div className="mb-6 rounded-xl border border-border bg-card p-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Ubicación</label>
              <select
                value={filterLocation}
                onChange={(e) => setFilterLocation(e.target.value)}
                className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
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
                className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
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

      {/* Contador de resultados con filtros */}
      {(hasActiveFilters || search) && (
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
      )}

      {/* Lista de ofertas */}
      <div className="space-y-3">
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredOfertas.length > 0 ? (
          filteredOfertas.map((job) => <JobCard key={job.id} job={job} />)
        ) : (
          <div className="rounded-xl border border-border bg-card p-12 text-center">
            <p className="text-muted-foreground">
              {search || hasActiveFilters
                ? "No se encontraron ofertas con los criterios seleccionados."
                : "No hay ofertas disponibles en este momento."}
            </p>
            {(search || hasActiveFilters) && (
              <button
                onClick={() => {
                  setSearch("");
                  clearFilters();
                }}
                className="mt-3 text-sm font-medium text-primary hover:underline"
              >
                Limpiar búsqueda y filtros
              </button>
            )}
          </div>
        )}
      </div>

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
  );
}