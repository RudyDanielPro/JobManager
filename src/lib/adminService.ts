import api from './api';
import { PageResponse, User, Empresa, OfertaLaboral, Postulacion, Admin } from './types';

export interface DashboardStats {
  totalUsers: number;
  totalCandidates: number;
  totalCompanies: number;
  totalAdmins: number;
  totalOffers: number;
  activeOffers: number;
  totalPostulations: number;
  pendingPostulations: number;
}

export const adminService = {
  getStats: async (): Promise<DashboardStats> => {
    const response = await api.get('/admin/stats');
    return response.data;
  },

  getUsers: async (page = 0, size = 10, rol?: string): Promise<PageResponse<User>> => {
    const params: any = { page, size };
    if (rol) params.rol = rol;
    const response = await api.get('/admin/usuarios', { params });
    return response.data;
  },

  getUserById: async (id: number): Promise<User> => {
    const response = await api.get(`/admin/usuarios/${id}`);
    return response.data;
  },

  createUser: async (user: Partial<User>): Promise<User> => {
    const response = await api.post('/admin/usuarios', user);
    return response.data;
  },

  updateUser: async (id: number, user: Partial<User>): Promise<User> => {
    const response = await api.put(`/admin/usuarios/${id}`, user);
    return response.data;
  },

  updateUserRole: async (userId: number, rol: string): Promise<User> => {
    const response = await api.patch(`/admin/usuarios/${userId}/rol`, { rol });
    return response.data;
  },

  deleteUser: async (userId: number): Promise<void> => {
    await api.delete(`/admin/usuarios/${userId}`);
  },

  getCompanies: async (page = 0, size = 10): Promise<PageResponse<Empresa>> => {
    const response = await api.get('/admin/empresas', { params: { page, size } });
    return response.data;
  },

  getCompanyById: async (id: number): Promise<Empresa> => {
    const response = await api.get(`/admin/empresas/${id}`);
    return response.data;
  },

  createCompany: async (company: Partial<Empresa>): Promise<Empresa> => {
    const response = await api.post('/admin/empresas', company);
    return response.data;
  },

  updateCompany: async (id: number, company: Partial<Empresa>): Promise<Empresa> => {
    const response = await api.put(`/admin/empresas/${id}`, company);
    return response.data;
  },

  deleteCompany: async (companyId: number): Promise<void> => {
    await api.delete(`/admin/empresas/${companyId}`);
  },

  getOffers: async (page = 0, size = 10): Promise<PageResponse<OfertaLaboral>> => {
    const response = await api.get('/admin/ofertas', { params: { page, size } });
    return response.data;
  },

  getOfferById: async (id: number): Promise<OfertaLaboral> => {
    const response = await api.get(`/admin/ofertas/${id}`);
    return response.data;
  },

  createOffer: async (offer: Partial<OfertaLaboral>): Promise<OfertaLaboral> => {
    const response = await api.post('/admin/ofertas', offer);
    return response.data;
  },

  updateOffer: async (id: number, offer: Partial<OfertaLaboral>): Promise<OfertaLaboral> => {
    const response = await api.put(`/admin/ofertas/${id}`, offer);
    return response.data;
  },

  toggleOfferStatus: async (offerId: number): Promise<OfertaLaboral> => {
    const response = await api.patch(`/admin/ofertas/${offerId}/toggle`);
    return response.data;
  },

  deleteOffer: async (offerId: number): Promise<void> => {
    await api.delete(`/admin/ofertas/${offerId}`);
  },

  getPostulations: async (page = 0, size = 10): Promise<PageResponse<Postulacion>> => {
    const response = await api.get('/admin/postulaciones', { params: { page, size } });
    return response.data;
  },

  getPostulationById: async (id: number): Promise<Postulacion> => {
    const response = await api.get(`/admin/postulaciones/${id}`);
    return response.data;
  },

  updatePostulationStatus: async (postulationId: number, estado: boolean): Promise<Postulacion> => {
    const response = await api.patch(`/admin/postulaciones/${postulationId}/estado`, { estado });
    return response.data;
  },

  deletePostulation: async (postulationId: number): Promise<void> => {
    await api.delete(`/admin/postulaciones/${postulationId}`);
  },

  getAdminByUserId: async (userId: number): Promise<Admin> => {
    const response = await api.get(`/admin/usuarios/${userId}/admin`);
    return response.data;
  },

  updateAdmin: async (userId: number, data: { nombre: string; apellido: string }): Promise<Admin> => {
    const response = await api.put(`/admin/usuarios/${userId}/admin`, data);
    return response.data;
  },

  updateAdminFoto: async (userId: number, foto: File): Promise<User> => {
    const formData = new FormData();
    formData.append('archivo', foto);
    const response = await api.patch(`/admin/usuarios/${userId}/foto`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },
};