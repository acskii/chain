import axios from 'axios';

const DEFAULT_API_URL = 'http://localhost:5000/';

const api = axios.create({
  baseURL: (import.meta.env.VITE_API_URL || "/api")
});

const run = axios.create({
    baseURL: (import.meta.env.VITE_API_URL || "/run")
})

export const executionAPI = {
  getStatus: async (executionId) => api.get(`/execution/${executionId}`),
  getByChain: async (chainId) => api.get(`/execution/chain/${chainId}`),
  getAll: async (params) => api.get('/execution', { params }),
  delete: async (id) => api.delete(`/execution/${id}`)
};

export const chainAPI = {
  getAll: async (page = 1) => api.get(`/chain?page=${page}`),
  getOne: async (id) => api.get(`/chain/${id}`),
  create: async (name) => api.post('/chain', { name }),
  update: async (id, data) => api.patch(`/chain/${id}`, data),
  delete: async (id) => api.delete(`/chain/${id}`),
  run: async (chainId, payload) => run.post(`/chain/${chainId}`, payload),
};

export default api;