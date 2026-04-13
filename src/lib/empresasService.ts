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

  // ✅ CORREGIDO: Enviar archivo como multipart/form-data
  actualizarLogo: async (id: number, file: File): Promise<EmpresaResponse> => {
    const formData = new FormData();
    formData.append('logo', file);
    
    const response = await api.put(`/empresas/${id}/logo`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  eliminar: async (id: number): Promise<void> => {
    await api.delete(`/empresas/${id}`);
  }
};