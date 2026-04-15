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

  // --- Usuarios ---
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

  createUser: async (user: Partial<User> & { password?: string; nombre?: string; apellido?: string; nombreEmpresa?: string; descripcion?: string; url?: string }): Promise<User> => {

    const payload: any = {
      email: user.email,
      usuario: user.usuario,
      password: user.password,
      rol: user.rol,
    };

    // ✅ El backend espera estructura ANIDADA según la documentación
    if (user.rol === 'CANDIDATO') {
      payload.candidato = {
        nombre: user.nombre || '',
        apellido: user.apellido || '',
      };
    }

    if (user.rol === 'RECRUITER') {
      payload.empresa = {
        nombreEmpresa: user.nombreEmpresa || '',
        descripcion: user.descripcion || '',
        url: user.url || '',
      };
    }

    if (user.rol === 'ADMIN') {
      payload.admin = {
        nombre: user.nombre || '',
        apellido: user.apellido || '',
      };
    }
    const response = await api.post('/admin/usuarios', payload);
    return response.data;
  },

  updateUser: async (id: number, user: Partial<User> & { password?: string; nombre?: string; apellido?: string; nombreEmpresa?: string; descripcion?: string; url?: string }): Promise<User> => {
    
    const payload: any = {
      email: user.email,
      usuario: user.usuario,
      rol: user.rol,
    };

    if (user.password) {
      payload.password = user.password;
    }

    if (user.rol === 'CANDIDATO') {
      payload.candidato = {
        nombre: user.nombre || '',
        apellido: user.apellido || '',
      };
    }

    if (user.rol === 'RECRUITER') {
      payload.empresa = {
        nombreEmpresa: user.nombreEmpresa || '',
        descripcion: user.descripcion || '',
        url: user.url || '',
      };
    }

    if (user.rol === 'ADMIN') {
      payload.admin = {
        nombre: user.nombre || '',
        apellido: user.apellido || '',
      };
    }
    const response = await api.put(`/admin/usuarios/${id}`, payload);
    return response.data;
  },

  updateUserRole: async (userId: number, rol: string): Promise<User> => {
    const response = await api.patch(`/admin/usuarios/${userId}/rol`, { rol });
    return response.data;
  },

  deleteUser: async (userId: number): Promise<void> => {
    await api.delete(`/admin/usuarios/${userId}`);
  },

  // --- Administradores ---
  getAdminByUserId: async (userId: number): Promise<Admin> => {
    const response = await api.get(`/admin/usuarios/${userId}/admin`);
    return response.data;
  },

  updateAdmin: async (userId: number, data: { id?: number, nombre: string; apellido: string }): Promise<Admin> => {
    const response = await api.put(`/admin/usuarios/${userId}/admin`, data);
    return response.data;
  },

  // --- Empresas ---
  getCompanies: async (page = 0, size = 10): Promise<PageResponse<Empresa>> => {
    const response = await api.get('/admin/empresas', { params: { page, size } });
    return response.data;
  },

  deleteCompany: async (companyId: number): Promise<void> => {
    await api.delete(`/admin/empresas/${companyId}`);
  },

  // --- Ofertas ---
  getOffers: async (page = 0, size = 10): Promise<PageResponse<OfertaLaboral>> => {
    const response = await api.get('/admin/ofertas', { params: { page, size } });
    return response.data;
  },

  toggleOfferStatus: async (offerId: number): Promise<OfertaLaboral> => {
    const response = await api.patch(`/admin/ofertas/${offerId}/toggle`);
    return response.data;
  },

  deleteOffer: async (offerId: number): Promise<void> => {
    await api.delete(`/admin/ofertas/${offerId}`);
  },

  // --- Postulaciones ---
  getPostulations: async (page = 0, size = 10): Promise<PageResponse<Postulacion>> => {
    const response = await api.get('/admin/postulaciones', { params: { page, size } });
    return response.data;
  },

  updatePostulationStatus: async (postulationId: number, estado: boolean): Promise<Postulacion> => {
    const response = await api.patch(`/admin/postulaciones/${postulationId}/estado`, { estado });
    return response.data;
  }
};