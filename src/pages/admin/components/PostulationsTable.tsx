import { Eye, Search, Download, ChevronLeft, ChevronRight, CheckCircle, Clock, Calendar } from 'lucide-react';
import { useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import type { Postulacion } from '@/lib/types';

interface PostulationsTableProps {
  postulations: Postulacion[];
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  onView?: (postulation: Postulacion) => void;
  onToggleStatus?: (postulation: Postulacion) => void;
}

export default function PostulationsTable({ 
  postulations, 
  totalPages, 
  currentPage, 
  onPageChange,
  onView,
  onToggleStatus
}: PostulationsTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const filteredPostulations = postulations.filter(post => {
    const matchesSearch = searchTerm === '' ||
      post.nombreCandidato?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.tituloOferta?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.nombreEmpresa?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === '' || 
      (filterStatus === 'accepted' && post.estado === true) ||
      (filterStatus === 'pending' && post.estado === false);
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar postulaciones..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-10 w-80 rounded-lg border border-border bg-card pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="h-10 rounded-lg border border-border bg-card px-3 text-sm text-foreground focus:border-primary focus:outline-none"
          >
            <option value="">Todos los estados</option>
            <option value="accepted">Aceptadas</option>
            <option value="pending">Pendientes</option>
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
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Candidato</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Oferta</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Empresa</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Fecha</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Estado</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredPostulations.map((post) => (
                <tr key={post.id} className="border-b border-border hover:bg-secondary/30">
                  <td className="px-4 py-3 text-sm text-muted-foreground">{post.id}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col">
                      <span className="font-medium text-foreground">{post.nombreCandidato || '-'}</span>
                      <span className="text-xs text-muted-foreground">{post.emailCandidato || '-'}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground">{post.tituloOferta || '-'}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{post.nombreEmpresa || '-'}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {post.fechaPostulacion ? format(new Date(post.fechaPostulacion), 'dd/MM/yyyy', { locale: es }) : '-'}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {onToggleStatus ? (
                      <button
                        onClick={() => onToggleStatus(post)}
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium transition-colors ${
                          post.estado 
                            ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                            : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                        }`}
                      >
                        {post.estado ? (
                          <CheckCircle className="h-3 w-3" />
                        ) : (
                          <Clock className="h-3 w-3" />
                        )}
                        {post.estado ? 'Aceptada' : 'Pendiente'}
                      </button>
                    ) : (
                      <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                        post.estado ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {post.estado ? 'Aceptada' : 'Pendiente'}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      {onView && (
                        <button onClick={() => onView(post)} className="rounded p-1 text-blue-600 hover:bg-blue-50">
                          <Eye className="h-4 w-4" />
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