// API service for Django backend
const API_BASE_URL = 'http://localhost:8000/api';

class ApiService {
  constructor() {
    this.token = null;
    // Don't auto-load token from localStorage to avoid stale tokens
  }

  setToken(token) {
    console.log('Setting token:', token);
    this.token = token;
    localStorage.setItem('token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('token');
  }

  loadToken() {
    const token = localStorage.getItem('token');
    if (token && token !== 'dummy token') {
      this.token = token;
    }
    return this.token;
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    if (this.token) {
      config.headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const error = await response.text();
        throw new Error(`HTTP ${response.status}: ${error}`);
      }

      return response.json();
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Cannot connect to server. Make sure Django is running on http://localhost:8000');
      }
      throw error;
    }
  }

  // Auth endpoints
  async register(userData) {
    return this.request('/auth/register/', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(credentials) {
    try {
      const response = await this.request('/auth/login/', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });
      
      if (response.token) {
        this.setToken(response.token);
      } else {
        throw new Error('No token received from server');
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  }

  async logout() {
    await this.request('/auth/logout/', { method: 'POST' });
    this.clearToken();
  }

  // Posts endpoints
  async getPosts() {
    return this.request('/posts/');
  }

  async createPost(postData) {
    if (!this.token) {
      throw new Error('Not logged in. Please login first.');
    }

    const formData = new FormData();
    Object.keys(postData).forEach(key => {
      if (key === 'image' && postData[key]) {
        formData.append('image', postData[key]);
      } else {
        formData.append(key, postData[key]);
      }
    });

    const url = `${API_BASE_URL}/posts/`;
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.token}`,
        },
        body: formData,
      });
      
      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Create post failed: ${error}`);
      }
      
      return response.json();
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Cannot connect to server. Make sure Django is running.');
      }
      throw error;
    }
  }

  async publishPost(postId, publishData) {
    if (!this.token) {
      throw new Error('Not logged in. Please login first.');
    }

    const formData = new FormData();
    formData.append('platforms', JSON.stringify(publishData.platforms));
    formData.append('credentials', JSON.stringify(publishData.credentials || {}));

    const url = `${API_BASE_URL}/posts/${postId}/publish/`;
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.token}`,
        },
        body: formData,
      });
      
      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Publish failed: ${error}`);
      }
      
      return response.json();
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Cannot connect to server.');
      }
      throw error;
    }
  }

  async generateImage(prompt) {
    return this.request('/posts/generate_image/', {
      method: 'POST',
      body: JSON.stringify({ prompt }),
    });
  }

  // Profile management
  async updateProfile(profileData) {
    return this.request('/auth/profile/', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  async changePassword(passwordData) {
    return this.request('/auth/change-password/', {
      method: 'POST',
      body: JSON.stringify(passwordData),
    });
  }

  async getProfile() {
    return this.request('/auth/profile/');
  }
}

export default new ApiService();