import { Eye, Trash2, Search, Download, ChevronLeft, ChevronRight, CheckCircle, XCircle, MapPin, DollarSign } from 'lucide-react';
import { useState } from 'react';
import type { OfertaLaboral } from '@/lib/types';

interface OffersTableProps {
  offers: OfertaLaboral[];
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  onToggleStatus?: (offerId: number) => void;
  onDelete?: (offer: OfertaLaboral) => void;
  onView?: (offer: OfertaLaboral) => void;
}

export default function OffersTable({ 
  offers, 
  totalPages, 
  currentPage, 
  onPageChange,
  onToggleStatus,
  onDelete,
  onView
}: OffersTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const filteredOffers = offers.filter(offer => {
    const matchesSearch = searchTerm === '' ||
      offer.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (offer.nombreEmpresa || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      offer.ubicacion?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === '' || 
      (filterStatus === 'active' && offer.estado) ||
      (filterStatus === 'inactive' && !offer.estado);
    return matchesSearch && matchesStatus;
  });

  const handleToggleStatus = (offerId: number) => {
    if (onToggleStatus) {
      onToggleStatus(offerId);
    }
  };

  // ✅ Función para obtener el nombre de la empresa
  const getEmpresaNombre = (offer: OfertaLaboral): string => {
    return offer.nombreEmpresa || offer.empresa?.nombreEmpresa || '-';
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar ofertas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-10 w-64 rounded-lg border border-border bg-card pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="h-10 rounded-lg border border-border bg-card px-3 text-sm text-foreground focus:border-primary focus:outline-none"
          >
            <option value="">Todos los estados</option>
            <option value="active">Activas</option>
            <option value="inactive">Inactivas</option>
          </select>
        </div>
        <button className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground hover:bg-secondary">
          <Download className="h-4 w-4" />
          Exportar
        </button>
      </div>

      <div className="rounded-xl border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-border bg-secondary/50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Título</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Empresa</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Ubicación</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Salario</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Estado</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredOffers.map((offer) => (
                <tr key={offer.id} className="border-b border-border hover:bg-secondary/30">
                  <td className="px-4 py-3 text-sm text-muted-foreground">{offer.id}</td>
                  <td className="px-4 py-3 text-sm font-medium text-foreground">{offer.titulo}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{getEmpresaNombre(offer)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      {offer.ubicacion || 'Remoto'}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <DollarSign className="h-3 w-3" />
                      {offer.rangoSalarial || 'No especificado'}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleToggleStatus(offer.id)}
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium transition-colors ${
                        offer.estado 
                          ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {offer.estado ? (
                        <CheckCircle className="h-3 w-3" />
                      ) : (
                        <XCircle className="h-3 w-3" />
                      )}
                      {offer.estado ? 'Activa' : 'Inactiva'}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      {onView && (
                        <button onClick={() => onView(offer)} className="rounded p-1 text-blue-600 hover:bg-blue-50">
                          <Eye className="h-4 w-4" />
                        </button>
                      )}
                      {onDelete && (
                        <button onClick={() => onDelete(offer)} className="rounded p-1 text-destructive hover:bg-destructive/10">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-border px-4 py-3">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 0}
              className="flex items-center gap-1 rounded-lg border border-border px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary disabled:opacity-50"
            >
              <ChevronLeft className="h-4 w-4" />
              Anterior
            </button>
            <span className="text-sm text-muted-foreground">
              Página {currentPage + 1} de {totalPages}
            </span>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= totalPages - 1}
              className="flex items-center gap-1 rounded-lg border border-border px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary disabled:opacity-50"
            >
              Siguiente
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}