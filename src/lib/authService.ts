import api from './api';
import { LoginResponse } from './types';
import { candidatosService } from './candidatosService';
import { empresasService } from './empresasService';

export interface LoginCredentials {
  identificador: string;
  password: string;
}

export interface RegisterData {
  email: string;
  usuario: string;
  password: string;
  rol: string;
  nombre?: string;
  apellido?: string;
  nombreEmpresa?: string;
  descripcion?: string;
  url?: string;
}

export const authService = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    
    const response = await api.post('/auth/login', credentials);
    const loginData: LoginResponse = response.data;
    
    localStorage.setItem('token', loginData.token);
    
    const userRole = loginData.rol?.toLowerCase();
   
    let additionalData = {};
    
    if (userRole === 'candidato') {
      ("🔵 authService.login - Usuario es candidato, obteniendo perfil");
      try {
        const candidatoData = await candidatosService.miPerfil();
       
        additionalData = {
          nombre: candidatoData.nombre,
          apellido: candidatoData.apellido,
          fotoUrl: candidatoData.fotoUrl,
        };
      } catch (error) {
        console.error("🔴 Error obteniendo perfil de candidato:", error);
      }
    } else if (userRole === 'recruiter') {
      ("🔵 authService.login - Usuario es reclutador, obteniendo perfil");
      try {
        const empresaData = await empresasService.miPerfil();

        additionalData = {
          nombreEmpresa: empresaData.nombreEmpresa,
          descripcion: empresaData.descripcion,
          url: empresaData.url,
          fotoUrl: empresaData.fotoUrl,
        };
      } catch (error) {
        console.error("🔴 Error obteniendo perfil de empresa:", error);
      }
    } else if (userRole === 'admin') {
      ("🔵 authService.login - Usuario es administrador");
    } else {
      console.warn("⚠️ authService.login - Rol de usuario desconocido:", userRole);
    }
    
    const fullUserData: LoginResponse = {
      ...loginData,
      ...additionalData,
    };
    
    localStorage.setItem('user', JSON.stringify(fullUserData));
    
    return fullUserData;
  },

  register: async (userData: RegisterData, foto?: File): Promise<any> => {
    const formData = new FormData();
    formData.append('usuario', JSON.stringify(userData));
    if (foto) {
      formData.append('archivo', foto);
    }
    const response = await api.post('/auth/registro', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  logout: () => {
    ("🔵 authService.logout - Cerrando sesión");
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: (): LoginResponse | null => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('token');
  }
};