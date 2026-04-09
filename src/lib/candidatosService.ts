import api from './api';
import { PageResponse } from './types';

export interface CandidatoUpdateRequest {
  nombre?: string;
  apellido?: string;
  email?: string;
  usuario?: string;
}

export interface CandidatoResponse {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  usuario: string;
  fotoUrl: string;
}

export const candidatosService = {
  listar: async (page = 0, size = 10): Promise<PageResponse<CandidatoResponse>> => {
    const response = await api.get('/candidatos', { params: { page, size } });
    return response.data;
  },

  obtenerPorId: async (id: number): Promise<CandidatoResponse> => {
    const response = await api.get(`/candidatos/${id}`);
    return response.data;
  },

  miPerfil: async (): Promise<CandidatoResponse> => {
    const response = await api.get('/candidatos/mi-perfil');
    return response.data;
  },

  actualizar: async (id: number, data: CandidatoUpdateRequest): Promise<CandidatoResponse> => {
    const response = await api.put(`/candidatos/${id}`, data);
    return response.data;
  },

  actualizarFoto: async (id: number, foto: File): Promise<CandidatoResponse> => {
    const formData = new FormData();
    formData.append('foto', foto);
    const response = await api.put(`/candidatos/${id}/foto`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  eliminar: async (id: number): Promise<void> => {
    await api.delete(`/candidatos/${id}`);
  }
};