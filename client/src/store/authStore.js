import { create } from "zustand";
import api from "../lib/api";

const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true, // Start true to check session on load
  error: null,

  // Login
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post("/auth/login", { email, password });
      set({
        user: response.data,
        isAuthenticated: true,
        isLoading: false,
      });
      return response.data; // Return user for redirect logic
    } catch (error) {
      set({
        error: error.response?.data?.message || "Login failed",
        isLoading: false,
      });
      throw error;
    }
  },

  // Register
  register: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post("/auth/register", userData);
      set({
        user: response.data,
        isAuthenticated: true,
        isLoading: false,
      });
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Registration failed",
        isLoading: false,
      });
      throw error;
    }
  },

  // Logout
  logout: async () => {
    set({ isLoading: true });
    try {
      await api.post("/auth/logout");
      set({ user: null, isAuthenticated: false, isLoading: false });
    } catch (error) {
      // Even if API fails, clear local state
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  // Check Auth (Session)
  checkAuth: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get("/auth/profile");
      set({
        user: response.data,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  // Update Profile
  updateProfile: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.put("/auth/profile", userData);
      set({
        user: response.data,
        isLoading: false,
      });
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Profile update failed",
        isLoading: false,
      });
      throw error;
    }
  },

  // Change Password
  changePassword: async (passwordData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.put("/auth/change-password", passwordData);
      set({ isLoading: false });
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Password change failed",
        isLoading: false,
      });
      throw error;
    }
  },
}));

export default useAuthStore;
