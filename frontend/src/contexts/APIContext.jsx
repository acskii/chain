/* Main contact between front-end and back-end */ 
import axios from 'axios';

/*
  LOCAL DEVELOPMENT -> Uses Proxy -> Keep VITE_API_URL = NULL AND PROXY_API_URL = http://localhost:5000/
  PRODUCTION -> Uses direct API backend url -> VITE_API_URL = ... WITH NO TRAILING FORWARD SLASH
*/
const API_BASE_URL = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL + "/api" : "/api";
const RUN_BASE_URL = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL + "/run" : "/run";

const api = axios.create({ baseURL: API_BASE_URL });
const run = axios.create({ baseURL: RUN_BASE_URL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('user_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

run.interceptors.request.use((config) => {
  const token = localStorage.getItem('user_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const executionAPI = {
  getOne: async (id) => api.get(`/execution/${id}`),
  getByChain: async (chainId) => api.get(`/execution/chain/${chainId}`),
  getAll: async (page = 1) => api.get('/execution', { page }),
  delete: async (id) => api.delete(`/execution/${id}`)
};

export const chainAPI = {
  getAll: async (page = 1) => api.get(`/chain?page=${page}`),
  getByUser: async (userId, page = 1) => api.get(`/chain/u/${userId}?page=${page}`),
  getOne: async (id) => api.get(`/chain/${id}`),
  create: async (name) => api.post('/chain', { name }),
  update: async (id, data) => api.patch(`/chain/${id}`, data),
  delete: async (id) => api.delete(`/chain/${id}`),
  run: async (chainId, payload) => run.post(`/chain/${chainId}`, payload),
};

export const userAPI = {
  getProfile: async (id = null) => api.get(`/user/profile${id ? `?userId=${id}` : ''}`),
  login: async (credentials) => api.post('/user/login', credentials),
  register: async (credentials) => api.post('/user/register', credentials),
};

export default api;