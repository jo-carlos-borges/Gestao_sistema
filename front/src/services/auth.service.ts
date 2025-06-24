import { LoginCredentials, RegisterData } from '../types';
import { mockAuthApi } from './mock-api';

// In a real app, this would use the real API
// For demo, we're using the mock API
export const authService = {
  async login(credentials: LoginCredentials) {
    return mockAuthApi.login(credentials);
  },
  
  async register(data: RegisterData) {
    return mockAuthApi.register(data);
  }
};