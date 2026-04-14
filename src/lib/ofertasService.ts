// ofertasService.ts
import api from './api';
import { PageResponse } from './types';
import { empresasService } from './empresasService';

export interface OfertaRequest {
  titulo: string;
  descripcion: string;
  ubicacion: string;
  rangoSalarial: string;
}

export interface OfertaResponse {
  id: number;
  titulo: string;
  descripcion: string;
  ubicacion: string;
  rangoSalarial: string;
  fechaCreacion: string;
  estado: boolean;
  nombreEmpresa: string;
  empresaId: number;
  fotoUrl?: string; // Añadimos este campo
}

// Función helper para enriquecer ofertas con el logo de la empresa
const enriquecerOfertasConLogo = async (ofertas: OfertaResponse[]): Promise<OfertaResponse[]> => {
  const ofertasEnriquecidas = await Promise.all(
    ofertas.map(async (oferta) => {
      try {
        // Obtener datos de la empresa para conseguir su logo
        const empresa = await empresasService.obtenerPorId(oferta.empresaId);
        return { ...oferta, fotoUrl: empresa.fotoUrl || null };
      } catch (error) {
        console.error(`Error obteniendo logo para empresa ${oferta.empresaId}:`, error);
        return oferta;
      }
    })
  );
  return ofertasEnriquecidas;
};

export const ofertasService = {
  listarActivas: async (page = 0, size = 10): Promise<PageResponse<OfertaResponse>> => {
    const response = await api.get('/ofertas/public/activas', {
      params: { page, size }
    });
    // Enriquecer con logos
    const contentEnriquecido = await enriquecerOfertasConLogo(response.data.content);
    return {
      ...response.data,
      content: contentEnriquecido
    };
  },

  buscar: async (titulo?: string, ubicacion?: string, page = 0, size = 10): Promise<PageResponse<OfertaResponse>> => {
    const params: any = { page, size };
    if (titulo) params.titulo = titulo;
    if (ubicacion) params.ubicacion = ubicacion;
    const response = await api.get('/ofertas/public/buscar', { params });
    const contentEnriquecido = await enriquecerOfertasConLogo(response.data.content);
    return {
      ...response.data,
      content: contentEnriquecido
    };
  },

  obtenerPublica: async (id: number): Promise<OfertaResponse> => {
    const response = await api.get(`/ofertas/public/${id}`);
    const oferta = response.data;
    // Enriquecer con logo
    try {
      const empresa = await empresasService.obtenerPorId(oferta.empresaId);
      return { ...oferta, fotoUrl: empresa.fotoUrl || null };
    } catch {
      return oferta;
    }
  },

  misOfertas: async (page = 0, size = 10): Promise<PageResponse<OfertaResponse>> => {
    const response = await api.get('/ofertas/empresa/mis-ofertas', {
      params: { page, size }
    });
    // Para mis ofertas, podemos obtener el logo de la empresa actual una sola vez
    try {
      const empresa = await empresasService.miPerfil();
      const contentEnriquecido = response.data.content.map((oferta: OfertaResponse) => ({
        ...oferta,
        fotoUrl: empresa.fotoUrl || null
      }));
      return {
        ...response.data,
        content: contentEnriquecido
      };
    } catch {
      return response.data;
    }
  },

  obtenerPorId: async (id: number): Promise<OfertaResponse> => {
    const response = await api.get(`/ofertas/${id}`);
    const oferta = response.data;
    try {
      const empresa = await empresasService.obtenerPorId(oferta.empresaId);
      return { ...oferta, fotoUrl: empresa.fotoUrl || null };
    } catch {
      return oferta;
    }
  },

  crear: async (oferta: OfertaRequest): Promise<OfertaResponse> => {
    const response = await api.post('/ofertas', oferta);
    return response.data;
  },

  actualizar: async (id: number, oferta: OfertaRequest): Promise<OfertaResponse> => {
    const response = await api.put(`/ofertas/${id}`, oferta);
    return response.data;
  },

  activar: async (id: number): Promise<OfertaResponse> => {
    const response = await api.patch(`/ofertas/${id}/activar`);
    return response.data;
  },

  desactivar: async (id: number): Promise<OfertaResponse> => {
    const response = await api.patch(`/ofertas/${id}/desactivar`);
    return response.data;
  },

  eliminar: async (id: number): Promise<void> => {
    await api.delete(`/ofertas/${id}`);
  }
};