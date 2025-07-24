import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register/', userData),
  login: (credentials) => api.post('/auth/login/', credentials),
};

// Posts API
export const postsAPI = {
  getAll: () => api.get('/posts/'),
  create: (postData) => api.post('/posts/', postData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  update: (id, postData) => api.put(`/posts/${id}/`, postData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  delete: (id) => api.delete(`/posts/${id}/`),
  generateImage: (prompt) => api.post('/posts/generate_image/', { prompt }),
  publish: (id, credentials) => api.post(`/posts/${id}/publish/`, { credentials }),
  getResults: (id) => api.get(`/posts/${id}/results/`),
};

// Social Accounts API
export const accountsAPI = {
  getAll: () => api.get('/accounts/'),
  create: (accountData) => api.post('/accounts/', accountData),
  update: (id, accountData) => api.put(`/accounts/${id}/`, accountData),
  delete: (id) => api.delete(`/accounts/${id}/`),
};

export default api;