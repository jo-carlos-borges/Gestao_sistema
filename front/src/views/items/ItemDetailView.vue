<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useItemsStore } from '../../store/items';
import PriceChart from '../../components/ui/PriceChart.vue';

const route = useRoute();
const router = useRouter();
const itemsStore = useItemsStore();

const loading = ref(true);
const showDeleteModal = ref(false);
const showAddPriceModal = ref(false);
const newPrice = ref<{ value: number, storeUrl: string }>({
  value: 0,
  storeUrl: ''
});

// Form validation
const priceError = ref('');

const itemId = computed(() => parseInt(route.params.id as string));

onMounted(async () => {
  try {
    await itemsStore.fetchItemById(itemId.value);
  } finally {
    loading.value = false;
  }
});

const item = computed(() => itemsStore.currentItem);

const sortedPrices = computed(() => {
  if (!item.value?.prices || item.value.prices.length === 0) {
    return [];
  }
  
  return [...item.value.prices].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
});

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString();
};

const formatPrice = (value: number) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
};

const priorityClass = computed(() => {
  if (!item.value) return '';
  
  switch (item.value.priority) {
    case 'HIGH': return 'bg-error-50 text-error-700 border-error-200';
    case 'MEDIUM': return 'bg-warning-50 text-warning-700 border-warning-200';
    case 'LOW': return 'bg-success-50 text-success-700 border-success-200';
    default: return 'bg-gray-50 text-gray-700 border-gray-200';
  }
});

const openAddPriceModal = () => {
  showAddPriceModal.value = true;
  newPrice.value = {
    value: 0,
    storeUrl: ''
  };
  priceError.value = '';
};

const closeAddPriceModal = () => {
  showAddPriceModal.value = false;
};

const submitNewPrice = async () => {
  // Validate price
  if (newPrice.value.value <= 0) {
    priceError.value = 'Price must be greater than zero';
    return;
  }
  
  try {
    await itemsStore.addPriceToItem(itemId.value, newPrice.value);
    closeAddPriceModal();
  } catch (err: any) {
    priceError.value = err.message || 'Failed to add price';
  }
};

const confirmDelete = async () => {
  try {
    const success = await itemsStore.deleteItem(itemId.value);
    if (success) {
      router.push('/items');
    }
  } catch (error) {
    console.error('Failed to delete item:', error);
  } finally {
    showDeleteModal.value = false;
  }
};
</script>

<template>
  <div>
    <!-- Loading indicator -->
    <div v-if="loading" class="flex justify-center my-8">
      <svg class="animate-spin h-8 w-8 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </div>
    
    <div v-else-if="!item" class="card text-center py-8">
      <p class="text-gray-600 mb-4">Item not found.</p>
      <router-link to="/items" class="btn btn-primary">
        Back to Items
      </router-link>
    </div>
    
    <template v-else>
      <!-- Back button and actions -->
      <div class="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div class="flex items-center">
          <router-link to="/items" class="text-gray-600 hover:text-gray-800 mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </router-link>
          <h1 class="text-2xl font-bold text-gray-800">{{ item.name }}</h1>
        </div>
        
        <div class="flex space-x-2 mt-2 md:mt-0">
          <router-link :to="`/items/${itemId}/edit`" class="btn btn-secondary">
            Edit
          </router-link>
          <button @click="showDeleteModal = true" class="btn bg-error-500 text-white hover:bg-error-600">
            Delete
          </button>
        </div>
      </div>
      
      <!-- Item details -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div class="card">
          <h2 class="text-lg font-semibold text-gray-800 mb-4">Details</h2>
          
          <div class="space-y-3">
            <div>
              <span class="text-gray-600 text-sm">Category:</span>
              <p class="font-medium text-gray-800">{{ item.category?.name || 'Uncategorized' }}</p>
            </div>
            
            <div>
              <span class="text-gray-600 text-sm">Priority:</span>
              <p>
                <span :class="`${priorityClass} text-xs px-2 py-1 rounded-full border inline-block mt-1`">
                  {{ item.priority }}
                </span>
              </p>
            </div>
            
            <div>
              <span class="text-gray-600 text-sm">Quantity:</span>
              <p class="font-medium text-gray-800">{{ item.quantity }}</p>
            </div>
          </div>
        </div>
        
        <div class="card md:col-span-2">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-lg font-semibold text-gray-800">Price History</h2>
            <button @click="openAddPriceModal" class="btn btn-primary text-sm">
              Add Price
            </button>
          </div>
          
          <PriceChart :prices="item.prices || []" />
        </div>
      </div>
      
      <!-- Price history table -->
      <div class="card">
        <h2 class="text-lg font-semibold text-gray-800 mb-4">Price History</h2>
        
        <div v-if="!sortedPrices.length" class="text-gray-500 italic py-4 text-center">
          No price history available.
        </div>
        
        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Store
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="price in sortedPrices" :key="price.id">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {{ formatDate(price.date) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                  {{ formatPrice(price.value) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  <a 
                    v-if="price.storeUrl" 
                    :href="price.storeUrl" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    class="text-primary-600 hover:text-primary-800"
                  >
                    View Store
                  </a>
                  <span v-else class="text-gray-500">No store link</span>
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
          <p class="text-gray-600 mb-6">
            Are you sure you want to delete "{{ item.name }}"? This action cannot be undone.
          </p>
          <div class="flex justify-end space-x-3">
            <button @click="showDeleteModal = false" class="btn btn-secondary">
              Cancel
            </button>
            <button @click="confirmDelete" class="btn bg-error-500 text-white hover:bg-error-600">
              Delete
            </button>
          </div>
        </div>
      </div>
      
      <!-- Add price modal -->
      <div v-if="showAddPriceModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-lg max-w-md w-full p-6">
          <h3 class="text-lg font-semibold text-gray-800 mb-4">Add New Price</h3>
          
          <form @submit.prevent="submitNewPrice">
            <div class="mb-4">
              <label for="price-value" class="form-label">Price</label>
              <input
                id="price-value"
                v-model.number="newPrice.value"
                type="number"
                step="0.01"
                min="0"
                class="form-input"
                placeholder="0.00"
                required
              />
            </div>
            
            <div class="mb-6">
              <label for="store-url" class="form-label">Store URL (optional)</label>
              <input
                id="store-url"
                v-model="newPrice.storeUrl"
                type="url"
                class="form-input"
                placeholder="https://example.com"
              />
            </div>
            
            <div v-if="priceError" class="mb-4 text-error-700 text-sm bg-error-50 p-2 rounded">
              {{ priceError }}
            </div>
            
            <div class="flex justify-end space-x-3">
              <button type="button" @click="closeAddPriceModal" class="btn btn-secondary">
                Cancel
              </button>
              <button type="submit" class="btn btn-primary">
                Add Price
              </button>
            </div>
          </form>
        </div>
      </div>
    </template>
  </div>
</template>