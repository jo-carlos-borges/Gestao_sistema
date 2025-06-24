<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useItemsStore } from '../../store/items';
import { useCategoriesStore } from '../../store/categories';

const route = useRoute();
const router = useRouter();
const itemsStore = useItemsStore();
const categoriesStore = useCategoriesStore();

const loading = ref(true);
const saving = ref(false);
const errorMessage = ref('');

// Form data
const name = ref('');
const quantity = ref(1);
const priority = ref('MEDIUM');
const categoryId = ref<number | null>(null);

const itemId = computed(() => parseInt(route.params.id as string));

onMounted(async () => {
  try {
    await Promise.all([
      categoriesStore.fetchCategories(),
      itemsStore.fetchItemById(itemId.value)
    ]);
    
    // Populate form with item data
    if (itemsStore.currentItem) {
      name.value = itemsStore.currentItem.name;
      quantity.value = itemsStore.currentItem.quantity;
      priority.value = itemsStore.currentItem.priority;
      categoryId.value = itemsStore.currentItem.categoryId;
    } else {
      errorMessage.value = 'Item not found';
    }
  } catch (error: any) {
    errorMessage.value = error.message || 'Failed to load item data';
  } finally {
    loading.value = false;
  }
});

const submitForm = async () => {
  // Validate form
  if (!name.value.trim()) {
    errorMessage.value = 'Name is required';
    return;
  }
  
  if (quantity.value < 0) {
    errorMessage.value = 'Quantity cannot be negative';
    return;
  }
  
  if (!categoryId.value) {
    errorMessage.value = 'Please select a category';
    return;
  }
  
  saving.value = true;
  errorMessage.value = '';
  
  try {
    const updatedItem = await itemsStore.updateItem(itemId.value, {
      name: name.value.trim(),
      quantity: quantity.value,
      priority: priority.value as 'HIGH' | 'MEDIUM' | 'LOW',
      categoryId: categoryId.value
    });
    
    if (updatedItem) {
      router.push(`/items/${updatedItem.id}`);
    } else {
      errorMessage.value = 'Failed to update item. Please try again.';
    }
  } catch (error: any) {
    errorMessage.value = error.message || 'An error occurred while updating the item.';
  } finally {
    saving.value = false;
  }
};
</script>

<template>
  <div>
    <!-- Header -->
    <div class="flex items-center mb-6">
      <router-link :to="`/items/${itemId}`" class="text-gray-600 hover:text-gray-800 mr-4">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
      </router-link>
      <h1 class="text-2xl font-bold text-gray-800">Edit Item</h1>
    </div>
    
    <!-- Loading indicator -->
    <div v-if="loading" class="flex justify-center my-8">
      <svg class="animate-spin h-8 w-8 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </div>
    
    <div v-else-if="!itemsStore.currentItem" class="card text-center py-8">
      <p class="text-gray-600 mb-4">Item not found.</p>
      <router-link to="/items" class="btn btn-primary">
        Back to Items
      </router-link>
    </div>
    
    <div v-else class="card max-w-2xl mx-auto">
      <form @submit.prevent="submitForm">
        <!-- Name field -->
        <div class="mb-4">
          <label for="name" class="form-label">Name</label>
          <input
            id="name"
            v-model="name"
            type="text"
            class="form-input"
            placeholder="Item name"
            required
          />
        </div>
        
        <!-- Quantity field -->
        <div class="mb-4">
          <label for="quantity" class="form-label">Quantity</label>
          <input
            id="quantity"
            v-model.number="quantity"
            type="number"
            min="0"
            class="form-input"
            required
          />
        </div>
        
        <!-- Priority field -->
        <div class="mb-4">
          <label for="priority" class="form-label">Priority</label>
          <select
            id="priority"
            v-model="priority"
            class="form-input"
            required
          >
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
        </div>
        
        <!-- Category field -->
        <div class="mb-6">
          <label for="category" class="form-label">Category</label>
          <select
            id="category"
            v-model="categoryId"
            class="form-input"
            required
          >
            <option :value="null" disabled>Select a category</option>
            <option v-for="category in categoriesStore.categories" :key="category.id" :value="category.id">
              {{ category.name }}
            </option>
          </select>
        </div>
        
        <!-- Error message -->
        <div v-if="errorMessage" class="mb-4 text-error-700 text-sm bg-error-50 p-2 rounded">
          {{ errorMessage }}
        </div>
        
        <!-- Form buttons -->
        <div class="flex justify-end space-x-3">
          <router-link :to="`/items/${itemId}`" class="btn btn-secondary">
            Cancel
          </router-link>
          <button
            type="submit"
            class="btn btn-primary"
            :disabled="saving"
          >
            <template v-if="saving">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </template>
            <template v-else>
              Save Changes
            </template>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>