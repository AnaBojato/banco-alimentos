import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api-banco-alimentos.com/v1', // URL provisional
});

// Esto asegura que si hay un login, el token se envíe siempre
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;