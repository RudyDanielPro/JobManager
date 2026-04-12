import api from './api';
import { PageResponse } from './types';

export interface PostulacionRequest {
  ofertaId: number;
  mensaje: string;
  cv: File;
  emailCandidato?: string;
  nombre?: string;
  apellido?: string;
}

export interface PostulacionResponse {
  id: number;
  fechaPostulacion: string;
  estado: boolean;
  nombreCandidato: string;
  emailCandidato: string;
  tituloOferta: string;
  nombreEmpresa: string;
  ofertaId: number;
}

export const postulacionesService = {
  enviar: async (datos: PostulacionRequest): Promise<PostulacionResponse> => {
    const formData = new FormData();
    formData.append('ofertaId', datos.ofertaId.toString());
    formData.append('mensaje', datos.mensaje);
    formData.append('cv', datos.cv);
    if (datos.emailCandidato) formData.append('emailCandidato', datos.emailCandidato);
    if (datos.nombre) formData.append('nombre', datos.nombre);
    if (datos.apellido) formData.append('apellido', datos.apellido);

    const response = await api.post('/postulaciones/enviar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    return response.data;
  },

  misPostulaciones: async (page = 0, size = 10): Promise<PageResponse<PostulacionResponse>> => {
    const response = await api.get('/postulaciones/mis-postulaciones', {
      params: { page, size }
    });
    return response.data;
  },

  postulacionesPorOferta: async (ofertaId: number, page = 0, size = 10): Promise<PageResponse<PostulacionResponse>> => {
    const response = await api.get(`/postulaciones/oferta/${ofertaId}`, {
      params: { page, size }
    });
    return response.data;
  }
};