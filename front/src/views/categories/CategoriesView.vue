<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useCategoriesStore } from '../../store/categories';
import { useItemsStore } from '../../store/items';

const categoriesStore = useCategoriesStore();
const itemsStore = useItemsStore();

const loading = ref(true);
const showDeleteModal = ref(false);
const categoryToDelete = ref<number | null>(null);
const deleteError = ref('');

onMounted(async () => {
  try {
    await Promise.all([
      categoriesStore.fetchCategories(),
      itemsStore.fetchItems()
    ]);
  } finally {
    loading.value = false;
  }
});

const getCategoryItemCount = (categoryId: number) => {
  return itemsStore.items.filter(item => item.categoryId === categoryId).length;
};

const openDeleteModal = (id: number) => {
  categoryToDelete.value = id;
  showDeleteModal.value = true;
  deleteError.value = '';
};

const closeDeleteModal = () => {
  showDeleteModal.value = false;
  categoryToDelete.value = null;
};

const confirmDelete = async () => {
  if (!categoryToDelete.value) return;
  
  // Check if the category has items
  const itemCount = getCategoryItemCount(categoryToDelete.value);
  if (itemCount > 0) {
    deleteError.value = `This category contains ${itemCount} items. Please remove or reassign these items first.`;
    return;
  }
  
  try {
    await categoriesStore.deleteCategory(categoryToDelete.value);
    closeDeleteModal();
  } catch (error: any) {
    deleteError.value = error.message || 'Failed to delete category';
  }
};
</script>

<template>
  <div>
    <div class="flex flex-col md:flex-row md:items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Categories</h1>
      
      <router-link to="/categories/add" class="btn btn-primary mt-2 md:mt-0">
        Add New Category
      </router-link>
    </div>
    
    <!-- Loading indicator -->
    <div v-if="loading" class="flex justify-center my-8">
      <svg class="animate-spin h-8 w-8 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </div>
    
    <!-- No categories message -->
    <div v-else-if="categoriesStore.categories.length === 0" class="card text-center py-8">
      <p class="text-gray-600 mb-4">No categories have been created yet.</p>
      <router-link to="/categories/add" class="btn btn-primary">
        Add Your First Category
      </router-link>
    </div>
    
    <!-- Categories list -->
    <div v-else class="card">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Items
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="category in categoriesStore.categories" :key="category.id">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                {{ category.name }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                <span class="bg-primary-100 text-primary-800 px-2 py-0.5 rounded-full text-xs">
                  {{ getCategoryItemCount(category.id) }} items
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm">
                <router-link 
                  :to="`/categories/${category.id}/edit`" 
                  class="text-primary-600 hover:text-primary-800 mr-3"
                >
                  Edit
                </router-link>
                <button 
                  @click="openDeleteModal(category.id)"
                  class="text-error-600 hover:text-error-800"
                >
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    
    <!-- Delete confirmation modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg max-w-md w-full p-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">Confirm Deletion</h3>
        
        <p class="text-gray-600 mb-4">
          Are you sure you want to delete this category? This action cannot be undone.
        </p>
        
        <div v-if="deleteError" class="mb-4 text-error-700 text-sm bg-error-50 p-2 rounded">
          {{ deleteError }}
        </div>
        
        <div class="flex justify-end space-x-3">
          <button @click="closeDeleteModal" class="btn btn-secondary">
            Cancel
          </button>
          <button 
            @click="confirmDelete" 
            class="btn bg-error-500 text-white hover:bg-error-600"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>