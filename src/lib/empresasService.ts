import api from './api';
import { PageResponse } from './types';

export interface EmpresaUpdateRequest {
  nombreEmpresa?: string;
  descripcion?: string;
  url?: string;
  email?: string;
}

export interface EmpresaResponse {
  id: number;
  nombreEmpresa: string;
  descripcion: string;
  url: string;
  email: string;
  usuario: string;
  fotoUrl: string;
}

export const empresasService = {
  listar: async (page = 0, size = 10): Promise<PageResponse<EmpresaResponse>> => {
    const response = await api.get('/empresas', { params: { page, size } });
    return response.data;
  },

  obtenerPorId: async (id: number): Promise<EmpresaResponse> => {
    const response = await api.get(`/empresas/${id}`);
    return response.data;
  },

  miPerfil: async (): Promise<EmpresaResponse> => {
    const response = await api.get('/empresas/mi-perfil');
    return response.data;
  },

  buscar: async (keyword: string, page = 0, size = 10): Promise<PageResponse<EmpresaResponse>> => {
    const response = await api.get('/empresas/buscar', { params: { keyword, page, size } });
    return response.data;
  },

  actualizar: async (id: number, data: EmpresaUpdateRequest): Promise<EmpresaResponse> => {
    const response = await api.put(`/empresas/${id}`, data);
    return response.data;
  },

  actualizarLogo: async (id: number, logoUrlBase64: string): Promise<EmpresaResponse> => {
    // El backend documenta consumir application/json con formato { "logo": "string" }
    const response = await api.put(`/empresas/${id}/logo`, { logo: logoUrlBase64 });
    return response.data;
  },

  eliminar: async (id: number): Promise<void> => {
    await api.delete(`/empresas/${id}`);
  }
};