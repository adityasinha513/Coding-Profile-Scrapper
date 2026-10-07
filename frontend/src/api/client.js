import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request interceptor: attach JWT token
client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle session expiration
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If unauthorized and not already on /login, clear token
      if (window.location.pathname !== '/login') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: async (email, password) => {
    const res = await client.post('/auth/login', { email, password });
    return res.data;
  },
  register: async (userData) => {
    const res = await client.post('/auth/register', userData);
    return res.data;
  },
  getMe: async () => {
    const res = await client.get('/auth/me');
    return res.data;
  },
};

export const profilesAPI = {
  getProfiles: async (refresh = false) => {
    const res = await client.get(`/profiles${refresh ? '?refresh=true' : ''}`);
    return res.data;
  },
  updateHandles: async (handles) => {
    const res = await client.put('/profiles/handles', handles);
    return res.data;
  },
  previewHandle: async (platform, handle) => {
    const res = await client.get(`/profiles/scrape/${platform}/${encodeURIComponent(handle)}`);
    return res.data;
  },
};

export const friendsAPI = {
  getFriends: async () => {
    const res = await client.get('/friends');
    return res.data;
  },
  addFriend: async (friendData) => {
    const res = await client.post('/friends', friendData);
    return res.data;
  },
  deleteFriend: async (id) => {
    const res = await client.delete(`/friends/${id}`);
    return res.data;
  },
};

export const leaderboardAPI = {
  getLeaderboard: async () => {
    const res = await client.get('/leaderboard');
    return res.data;
  },
};

export default client;
