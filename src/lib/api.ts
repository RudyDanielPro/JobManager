import axios from 'axios';

const api = axios.create({
  baseURL: 'https://jobmanagerbackend.onrender.com/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log(`📤 ${config.method?.toUpperCase()} ${config.url}`, config.data);
  return config;
});

api.interceptors.response.use(
  (response) => {
    console.log(`📥 Respuesta de ${response.config.url}:`, response.status);
    return response;
  },
  (error) => {
    console.error(`❌ Error en ${error.config?.url}:`, error.response?.status, error.response?.data);
    
    if (error.response?.status === 401) {
      const url = error.config?.url || '';
      const method = error.config?.method || '';
      const isCreateUser = url.includes('/admin/usuarios') && method === 'post';
      
      // No redirigir en creación de usuarios, solo mostrar error
      if (!isCreateUser) {
        const token = localStorage.getItem('token');
        if (token) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
            window.location.href = '/login';
          }
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;