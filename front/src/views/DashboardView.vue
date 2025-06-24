<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useItemsStore } from '../store/items';
import { useCategoriesStore } from '../store/categories';
import ItemCard from '../components/ui/ItemCard.vue';

const itemsStore = useItemsStore();
const categoriesStore = useCategoriesStore();

const loading = ref(true);

onMounted(async () => {
  try {
    await Promise.all([
      itemsStore.fetchItems(),
      categoriesStore.fetchCategories()
    ]);
  } finally {
    loading.value = false;
  }
});

const lowStockItems = computed(() => itemsStore.lowStockItems);
const groupedByCategory = computed(() => {
  // Create a map of category names for easy lookup
  const categoryNames = new Map();
  categoriesStore.categories.forEach(cat => {
    categoryNames.set(cat.id, cat.name);
  });
  
  // Transform the store's groupedByCategory into an array with category names
  return Object.entries(itemsStore.groupedByCategory).map(([categoryId, items]) => ({
    categoryId: parseInt(categoryId),
    categoryName: categoryNames.get(parseInt(categoryId)) || 'Uncategorized',
    items
  }));
});

const categoryItemCount = computed(() => {
  return groupedByCategory.value.map(group => ({
    name: group.categoryName,
    count: group.items.length
  }));
});

const priorityCounts = computed(() => {
  const counts = { HIGH: 0, MEDIUM: 0, LOW: 0 };
  
  itemsStore.items.forEach(item => {
    counts[item.priority]++;
  });
  
  return counts;
});
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>
    
    <div v-if="loading" class="flex justify-center my-8">
      <svg class="animate-spin h-8 w-8 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </div>
    
    <div v-else>
      <!-- Overview Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="card bg-primary-50 border-primary-100">
          <h3 class="text-lg font-medium text-primary-800 mb-1">Total Itens</h3>
          <p class="text-3xl font-bold text-primary-700">{{ itemsStore.items.length }}</p>
          <div class="mt-2 text-sm text-primary-600">
            <router-link to="/items" class="hover:underline">Ver todos os itens →</router-link>
          </div>
        </div>
        
        <div class="card bg-accent-50 border-accent-100">
          <h3 class="text-lg font-medium text-accent-800 mb-1">Categorias</h3>
          <p class="text-3xl font-bold text-accent-700">{{ categoriesStore.categories.length }}</p>
          <div class="mt-2 text-sm text-accent-600">
            <router-link to="/categories" class="hover:underline">Gerenciar categorias →</router-link>
          </div>
        </div>
        
        <div class="card bg-warning-50 border-warning-100">
          <h3 class="text-lg font-medium text-warning-800 mb-1">Itens com estoque baixo</h3>
          <p class="text-3xl font-bold text-warning-700">{{ lowStockItems.length }}</p>
          <div class="mt-2 text-sm text-warning-600">
            <router-link to="/items" class="hover:underline">Verifique o inventário →</router-link>
          </div>
        </div>
      </div>
      
      <!-- Low Stock Items -->
      <div class="mb-8">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">Itens com estoque baixo</h2>
        
        <div v-if="lowStockItems.length === 0" class="card text-gray-500 italic">
          Nenhum item em estoque baixo.
        </div>
        
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <ItemCard v-for="item in lowStockItems" :key="item.id" :item="item" />
        </div>
      </div>
      
      <!-- Categories Breakdown -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div class="card">
          <h2 class="text-xl font-semibold text-gray-800 mb-4">Divisão de categorias</h2>
          
          <div v-if="categoryItemCount.length === 0" class="text-gray-500 italic">
            Nenhuma categoria encontrada.
          </div>
          
          <div v-else>
            <div v-for="category in categoryItemCount" :key="category.name" class="flex justify-between items-center mb-2">
              <span class="text-gray-700">{{ category.name }}</span>
              <span class="bg-primary-100 text-primary-800 px-2 py-0.5 rounded-full text-sm">
                {{ category.count }} items
              </span>
            </div>
          </div>
        </div>
        
        <div class="card">
          <h2 class="text-xl font-semibold text-gray-800 mb-4">Distribuição Prioritária</h2>
          
          <div class="space-y-3">
            <div class="flex items-center">
              <span class="bg-error-50 text-error-700 border border-error-200 text-xs px-2 py-1 rounded-full w-20 text-center">
                ALTA
              </span>
              <div class="ml-3 flex-1 bg-gray-200 rounded-full h-4">
                <div 
                  class="bg-error-500 h-4 rounded-full" 
                  :style="`width: ${itemsStore.items.length ? (priorityCounts.HIGH / itemsStore.items.length * 100) : 0}%`"
                ></div>
              </div>
              <span class="ml-2 text-gray-700 w-8 text-right">{{ priorityCounts.HIGH }}</span>
            </div>
            
            <div class="flex items-center">
              <span class="bg-warning-50 text-warning-700 border border-warning-200 text-xs px-2 py-1 rounded-full w-20 text-center">
                MÉDIA
              </span>
              <div class="ml-3 flex-1 bg-gray-200 rounded-full h-4">
                <div 
                  class="bg-warning-500 h-4 rounded-full" 
                  :style="`width: ${itemsStore.items.length ? (priorityCounts.MEDIUM / itemsStore.items.length * 100) : 0}%`"
                ></div>
              </div>
              <span class="ml-2 text-gray-700 w-8 text-right">{{ priorityCounts.MEDIUM }}</span>
            </div>
            
            <div class="flex items-center">
              <span class="bg-success-50 text-success-700 border border-success-200 text-xs px-2 py-1 rounded-full w-20 text-center">
                BAIXA
              </span>
              <div class="ml-3 flex-1 bg-gray-200 rounded-full h-4">
                <div 
                  class="bg-success-500 h-4 rounded-full" 
                  :style="`width: ${itemsStore.items.length ? (priorityCounts.LOW / itemsStore.items.length * 100) : 0}%`"
                ></div>
              </div>
              <span class="ml-2 text-gray-700 w-8 text-right">{{ priorityCounts.LOW }}</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Quick Actions -->
      <div class="card">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">Ações rápidas</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <router-link to="/items/add" class="btn btn-primary text-center">Adicionar novo item</router-link>
          <router-link to="/categories/add" class="btn btn-secondary text-center">Adicionar nova categoria</router-link>
          <router-link to="/items" class="btn btn-accent text-center">Ver todos os itens</router-link>
        </div>
      </div>
    </div>
  </div>
</template>