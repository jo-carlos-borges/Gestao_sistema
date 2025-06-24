<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useItemsStore } from '../../store/items';
import { useCategoriesStore } from '../../store/categories';
import ItemCard from '../../components/ui/ItemCard.vue';

const itemsStore = useItemsStore();
const categoriesStore = useCategoriesStore();

const loading = ref(true);
const searchQuery = ref('');
const selectedCategory = ref<number | null>(null);
const selectedPriority = ref<string | null>(null);

// Load data on mount
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

// Filtered items based on search and filters
const filteredItems = computed(() => {
  return itemsStore.items.filter(item => {
    // Filter by search query
    const matchesSearch = searchQuery.value === '' || 
      item.name.toLowerCase().includes(searchQuery.value.toLowerCase());
    
    // Filter by category
    const matchesCategory = selectedCategory.value === null || 
      item.categoryId === selectedCategory.value;
    
    // Filter by priority
    const matchesPriority = selectedPriority.value === null || 
      item.priority === selectedPriority.value;
    
    return matchesSearch && matchesCategory && matchesPriority;
  });
});

const clearFilters = () => {
  searchQuery.value = '';
  selectedCategory.value = null;
  selectedPriority.value = null;
};
</script>

<template>
  <div>
    <div class="flex flex-col md:flex-row md:items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Itens</h1>
      
      <router-link to="/items/add" class="btn btn-primary mt-2 md:mt-0">
        Adicionar novo item
      </router-link>
    </div>
    
    <!-- Filters and Search -->
    <div class="card mb-6">
      <div class="mb-4">
        <label for="search" class="form-label">Itens de pesquisa</label>
        <input 
          id="search"
          v-model="searchQuery"
          type="text"
          class="form-input"
          placeholder="Search by name..."
        />
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label for="category" class="form-label">Filtrar por categoria</label>
          <select id="category" v-model="selectedCategory" class="form-input">
            <option :value="null">Todas as categorias</option>
            <option v-for="category in categoriesStore.categories" :key="category.id" :value="category.id">
              {{ category.name }}
            </option>
          </select>
        </div>
        
        <div>
          <label for="priority" class="form-label">Filtrar por prioridade</label>
          <select id="priority" v-model="selectedPriority" class="form-input">
            <option :value="null">Todas as prioridades</option>
            <option value="HIGH">Alta</option>
            <option value="MEDIUM">Médio</option>
            <option value="LOW">Baixo</option>
          </select>
        </div>
      </div>
      
      <button @click="clearFilters" class="btn btn-secondary">
        Limpar filtros
      </button>
    </div>
    
    <!-- Loading indicator -->
    <div v-if="loading" class="flex justify-center my-8">
      <svg class="animate-spin h-8 w-8 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </div>
    
    <!-- No items message -->
    <div v-else-if="itemsStore.items.length === 0" class="card text-center py-8">
      <p class="text-gray-600 mb-4">Ainda não há itens na sua despensa.</p>
      <router-link to="/items/add" class="btn btn-primary">
        Adicione seu primeiro item
      </router-link>
    </div>
    
    <!-- No results from filters -->
    <div v-else-if="filteredItems.length === 0" class="card text-center py-8">
      <p class="text-gray-600 mb-4">Nenhum item corresponde aos seus critérios de pesquisa.</p>
      <button @click="clearFilters" class="btn btn-secondary">
        Limpar filtros
      </button>
    </div>
    
    <!-- Items grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <ItemCard v-for="item in filteredItems" :key="item.id" :item="item" />
    </div>
  </div>
</template>