import axios from 'axios';

const api = axios.create({
  baseURL: (import.meta.env.VITE_API_URL || "/api")
});

const run = axios.create({
  baseURL: (import.meta.env.VITE_API_URL || "/run")
})

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
};

export default api;