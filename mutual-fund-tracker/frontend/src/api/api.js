import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('mf_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('mf_user');
      localStorage.removeItem('mf_token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// ── Auth ──────────────────────────────────────────────
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
};

// ── Funds ─────────────────────────────────────────────
export const fundsAPI = {
  getAll: (params) => api.get('/funds', { params }),
  getById: (id) => api.get(`/funds/${id}`),
  create: (data) => api.post('/funds', data),
  update: (id, data) => api.put(`/funds/${id}`, data),
  delete: (id) => api.delete(`/funds/${id}`),
};

// ── Investments ───────────────────────────────────────
export const investmentsAPI = {
  getAll: () => api.get('/investments'),
  getById: (id) => api.get(`/investments/${id}`),
  create: (data) => api.post('/investments', data),
  delete: (id) => api.delete(`/investments/${id}`),
};

// ── Dashboard ─────────────────────────────────────────
export const dashboardAPI = {
  getSummary: () => api.get('/dashboard/summary'),
};

export default api;
