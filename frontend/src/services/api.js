import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Include cookies for session auth
});

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register/', userData),
  login: (credentials) => api.post('/auth/login/', credentials, { withCredentials: true }),
  logout: () => api.post('/auth/logout/', {}, { withCredentials: true }),
};

// Posts API
export const postsAPI = {
  getAll: () => api.get('/posts/'),
  create: (postData) => api.post('/posts/', postData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    withCredentials: true
  }),
  update: (id, postData) => api.put(`/posts/${id}/`, postData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    withCredentials: true
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

// Add response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login or handle auth error
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

export default api;