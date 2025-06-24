import { mockCategoriesApi } from './mock-api';

// In a real app, this would use the real API
// For demo, we're using the mock API
export const categoriesService = {
  async getCategories() {
    return mockCategoriesApi.getCategories();
  },
  
  async createCategory(data: { name: string }) {
    return mockCategoriesApi.createCategory(data);
  },
  
  async updateCategory(id: number, data: { name: string }) {
    return mockCategoriesApi.updateCategory(id, data);
  },
  
  async deleteCategory(id: number) {
    return mockCategoriesApi.deleteCategory(id);
  }
};