import { defineStore } from 'pinia';
import { ref } from 'vue';
import { Category } from '../types';
import { categoriesService } from '../services/categories.service';

export const useCategoriesStore = defineStore('categories', () => {
  const categories = ref<Category[]>([]);
  const loading = ref<boolean>(false);
  const error = ref<string | null>(null);

  async function fetchCategories() {
    try {
      loading.value = true;
      error.value = null;
      categories.value = await categoriesService.getCategories();
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch categories';
    } finally {
      loading.value = false;
    }
  }

  async function addCategory(name: string) {
    try {
      loading.value = true;
      error.value = null;
      const newCategory = await categoriesService.createCategory({ name });
      categories.value.push(newCategory);
      return newCategory;
    } catch (err: any) {
      error.value = err.message || 'Failed to add category';
      return null;
    } finally {
      loading.value = false;
    }
  }

  async function updateCategory(id: number, name: string) {
    try {
      loading.value = true;
      error.value = null;
      const updatedCategory = await categoriesService.updateCategory(id, { name });
      
      const index = categories.value.findIndex(c => c.id === id);
      if (index !== -1) {
        categories.value[index] = updatedCategory;
      }
      
      return updatedCategory;
    } catch (err: any) {
      error.value = err.message || 'Failed to update category';
      return null;
    } finally {
      loading.value = false;
    }
  }

  async function deleteCategory(id: number) {
    try {
      loading.value = true;
      error.value = null;
      await categoriesService.deleteCategory(id);
      
      categories.value = categories.value.filter(category => category.id !== id);
      
      return true;
    } catch (err: any) {
      error.value = err.message || 'Failed to delete category';
      return false;
    } finally {
      loading.value = false;
    }
  }

  return {
    categories,
    loading,
    error,
    fetchCategories,
    addCategory,
    updateCategory,
    deleteCategory
  };
});