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
    console.log("🔵 authService.login - Enviando credenciales:", credentials.identificador);
    
    const response = await api.post('/auth/login', credentials);
    const loginData: LoginResponse = response.data;
    
    console.log("🔵 authService.login - Respuesta del backend:", loginData);
    console.log("🔵 authService.login - Rol recibido del backend:", loginData.rol);
    console.log("🔵 authService.login - Token recibido:", loginData.token ? "Sí" : "No");
    
    localStorage.setItem('token', loginData.token);
    
    const userRole = loginData.rol?.toLowerCase();
    console.log("🔵 authService.login - Rol en minúsculas:", userRole);
    
    let additionalData = {};
    
    if (userRole === 'candidato') {
      console.log("🔵 authService.login - Usuario es candidato, obteniendo perfil");
      try {
        const candidatoData = await candidatosService.miPerfil();
        console.log("🔵 authService.login - Datos del candidato:", candidatoData);
        additionalData = {
          nombre: candidatoData.nombre,
          apellido: candidatoData.apellido,
          fotoUrl: candidatoData.fotoUrl,
        };
      } catch (error) {
        console.error("🔴 Error obteniendo perfil de candidato:", error);
      }
    } else if (userRole === 'recruiter') {
      console.log("🔵 authService.login - Usuario es reclutador, obteniendo perfil");
      try {
        const empresaData = await empresasService.miPerfil();
        console.log("🔵 authService.login - Datos de la empresa:", empresaData);
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
      console.log("🔵 authService.login - Usuario es administrador");
    } else {
      console.log("🔵 authService.login - Rol no reconocido:", userRole);
    }
    
    const fullUserData: LoginResponse = {
      ...loginData,
      ...additionalData,
    };
    
    console.log("🔵 authService.login - Datos completos del usuario:", fullUserData);
    console.log("🔵 authService.login - Rol final:", fullUserData.rol);
    
    localStorage.setItem('user', JSON.stringify(fullUserData));
    
    return fullUserData;
  },

  register: async (userData: RegisterData, foto?: File): Promise<any> => {
    console.log("🔵 authService.register - Registrando usuario:", userData.usuario);
    const formData = new FormData();
    formData.append('usuario', JSON.stringify(userData));
    if (foto) {
      formData.append('archivo', foto);
    }
    const response = await api.post('/auth/registro', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    console.log("🔵 authService.register - Respuesta:", response.data);
    return response.data;
  },

  logout: () => {
    console.log("🔵 authService.logout - Cerrando sesión");
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