<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useCategoriesStore } from '../../store/categories';

const router = useRouter();
const categoriesStore = useCategoriesStore();

const name = ref('');
const loading = ref(false);
const errorMessage = ref('');

const submitForm = async () => {
  if (!name.value.trim()) {
    errorMessage.value = 'Category name is required';
    return;
  }
  
  loading.value = true;
  errorMessage.value = '';
  
  try {
    const newCategory = await categoriesStore.addCategory(name.value.trim());
    if (newCategory) {
      router.push('/categories');
    } else {
      errorMessage.value = 'Failed to add category';
    }
  } catch (error: any) {
    errorMessage.value = error.message || 'An error occurred while adding the category';
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div>
    <!-- Header -->
    <div class="flex items-center mb-6">
      <router-link to="/categories" class="text-gray-600 hover:text-gray-800 mr-4">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
      </router-link>
      <h1 class="text-2xl font-bold text-gray-800">Add New Category</h1>
    </div>
    
    <div class="card max-w-2xl mx-auto">
      <form @submit.prevent="submitForm">
        <div class="mb-6">
          <label for="name" class="form-label">Category Name</label>
          <input
            id="name"
            v-model="name"
            type="text"
            class="form-input"
            placeholder="Enter category name"
            required
          />
        </div>
        
        <div v-if="errorMessage" class="mb-4 text-error-700 text-sm bg-error-50 p-2 rounded">
          {{ errorMessage }}
        </div>
        
        <div class="flex justify-end space-x-3">
          <router-link to="/categories" class="btn btn-secondary">
            Cancel
          </router-link>
          <button
            type="submit"
            class="btn btn-primary"
            :disabled="loading"
          >
            <template v-if="loading">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </template>
            <template v-else>
              Save Category
            </template>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>