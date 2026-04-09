export interface UserFoto {
  id: number;
  ruta: string;
  nombreArchivo: string;
}

export interface Admin {
  id: number;
  nombre: string;
  apellido: string;
}

export interface Candidato {
  id: number;
  nombre: string;
  apellido: string;
  postulaciones?: Postulacion[];
}

export interface Empresa {
  id: number;
  nombreEmpresa: string;
  descripcion: string;
  url: string;
  email?: string;
  usuario?: string;
  fotoUrl?: string;
  ofertas?: OfertaLaboral[];
}

export interface User {
  id: number;
  email: string;
  usuario: string;
  password?: string;
  rol: string;
  foto?: UserFoto;
  candidato?: Candidato;
  empresa?: Empresa;
  admin?: Admin;
}

export interface OfertaLaboral {
  id: number;
  titulo: string;
  descripcion: string;
  ubicacion: string;
  rangoSalarial: string;
  fechaCreacion: string;
  estado: boolean;
  empresaId?: number;
  nombreEmpresa?: string;
}

export interface Postulacion {
  id: number;
  fechaPostulacion: string;
  estado: boolean;
  ofertaId?: number;
  nombreCandidato?: string;
  emailCandidato?: string;
  tituloOferta?: string;
  nombreEmpresa?: string;
}

export interface LoginResponse {
  token: string;
  rol: string;
  id: number;
  email: string;
  usuario: string;
  foto?: UserFoto;
  fotoUrl?: string;
  nombre?: string;
  apellido?: string;
  nombreEmpresa?: string;
  descripcion?: string; 
  url?: string;
}

export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}