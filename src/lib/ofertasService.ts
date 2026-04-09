import api from './api';
import { PageResponse } from './types';

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
}

export const ofertasService = {
  listarActivas: async (page = 0, size = 10): Promise<PageResponse<OfertaResponse>> => {
    const response = await api.get('/ofertas/public/activas', {
      params: { page, size }
    });
    return response.data;
  },

  buscar: async (titulo?: string, ubicacion?: string, page = 0, size = 10): Promise<PageResponse<OfertaResponse>> => {
    const params: any = { page, size };
    if (titulo) params.titulo = titulo;
    if (ubicacion) params.ubicacion = ubicacion;
    const response = await api.get('/ofertas/public/buscar', { params });
    return response.data;
  },

  obtenerPublica: async (id: number): Promise<OfertaResponse> => {
    const response = await api.get(`/ofertas/public/${id}`);
    return response.data;
  },

  misOfertas: async (page = 0, size = 10): Promise<PageResponse<OfertaResponse>> => {
    const response = await api.get('/ofertas/empresa/mis-ofertas', {
      params: { page, size }
    });
    return response.data;
  },

  obtenerPorId: async (id: number): Promise<OfertaResponse> => {
    const response = await api.get(`/ofertas/${id}`);
    return response.data;
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