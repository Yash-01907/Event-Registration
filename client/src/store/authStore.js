import { create } from 'zustand';
import api from '../lib/api';

const AUTH_STORAGE_KEY = 'event-registration-user';

const getStoredUser = () => {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const setStoredUser = (user) => {
  try {
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  } catch {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }
};

const storedUser = getStoredUser();

const useAuthStore = create((set) => ({
  user: storedUser,
  isAuthenticated: !!storedUser,
  isLoading: !storedUser, // Only loading if no cached user to show
  error: null,

  // Login
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/auth/login', { email, password });
      const user = response.data;
      setStoredUser(user);
      set({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
      return user; // Return user for redirect logic
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Login failed',
        isLoading: false,
      });
      throw error;
    }
  },

  // Register
  register: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/auth/register', userData);
      const user = response.data;
      setStoredUser(user);
      set({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
      return user;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Registration failed',
        isLoading: false,
      });
      throw error;
    }
  },

  // Logout
  logout: async () => {
    set({ isLoading: true });
    try {
      await api.post('/auth/logout');
    } catch {
      // Ignore API errors
    } finally {
      setStoredUser(null);
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  // Check Auth (Session) - verifies server session; hydrates from localStorage on init
  checkAuth: async () => {
    const hasCached = !!getStoredUser();
    if (!hasCached) set({ isLoading: true });
    try {
      const response = await api.get('/auth/profile');
      const user = response.data;
      setStoredUser(user);
      set({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch {
      setStoredUser(null);
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  // Update Profile
  updateProfile: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.put('/auth/profile', userData);
      const user = response.data;
      setStoredUser(user);
      set({ user, isLoading: false });
      return user;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Profile update failed',
        isLoading: false,
      });
      throw error;
    }
  },

  // Change Password
  changePassword: async (passwordData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.put('/auth/change-password', passwordData);
      set({ isLoading: false });
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Password change failed',
        isLoading: false,
      });
      throw error;
    }
  },
}));

export default useAuthStore;
