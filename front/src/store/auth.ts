import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { LoginCredentials, RegisterData, User } from '../types';
import { authService } from '../services/auth.service';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const token = ref<string | null>(null);
  const loading = ref<boolean>(false);
  const error = ref<string | null>(null);

  // Initialize from localStorage if available
  const storedToken = localStorage.getItem('auth_token');
  const storedUser = localStorage.getItem('auth_user');
  
  if (storedToken) {
    token.value = storedToken;
  }
  
  if (storedUser) {
    try {
      user.value = JSON.parse(storedUser);
    } catch (e) {
      localStorage.removeItem('auth_user');
    }
  }

  const isAuthenticated = computed(() => !!token.value);

  async function login(credentials: LoginCredentials) {
    try {
      loading.value = true;
      error.value = null;
      
      const response = await authService.login(credentials);
      
      token.value = response.token;
      user.value = response.user;
      
      // Store in localStorage
      localStorage.setItem('auth_token', response.token);
      localStorage.setItem('auth_user', JSON.stringify(response.user));
      
      return true;
    } catch (err: any) {
      error.value = err.message || 'Failed to login';
      return false;
    } finally {
      loading.value = false;
    }
  }

  async function register(data: RegisterData) {
    try {
      loading.value = true;
      error.value = null;
      
      const response = await authService.register(data);
      
      token.value = response.token;
      user.value = response.user;
      
      // Store in localStorage
      localStorage.setItem('auth_token', response.token);
      localStorage.setItem('auth_user', JSON.stringify(response.user));
      
      return true;
    } catch (err: any) {
      error.value = err.message || 'Failed to register';
      return false;
    } finally {
      loading.value = false;
    }
  }

  function logout() {
    user.value = null;
    token.value = null;
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
  }

  return {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    login,
    register,
    logout
  };
});