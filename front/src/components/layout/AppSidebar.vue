<script setup lang="ts">
import { computed } from 'vue';
import { useItemsStore } from '../../store/items';

const itemsStore = useItemsStore();

const lowStockCount = computed(() => {
  return itemsStore.lowStockItems.length;
});
</script>

<template>
  <aside class="hidden md:block w-64 bg-white border-r border-gray-200 h-full">
    <div class="p-4">
      <h2 class="text-lg font-semibold text-gray-800 mb-4">Gestão de Mudança</h2>
      
      <nav class="space-y-1">
        <router-link to="/dashboard" class="block px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100 hover:text-primary-600 transition-colors">
          Dashboard
        </router-link>
        
        <router-link to="/items" class="block px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100 hover:text-primary-600 transition-colors">
          Todos os Items
        </router-link>
        
        <router-link to="/categories" class="block px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100 hover:text-primary-600 transition-colors">
          Categorias
        </router-link>
        
        <router-link to="/items/add" class="block px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100 hover:text-primary-600 transition-colors">
          Adicionar Novo Item
        </router-link>
      </nav>
      
      <div class="mt-8">
        <h3 class="text-sm font-medium uppercase text-gray-500 mb-2">Alertas</h3>
        
        <div class="bg-orange-50 p-3 rounded-md border border-orange-100">
          <router-link to="/items" class="flex items-center text-orange-800">
            <span class="font-medium">Itens com Estoque Baixo</span>
            <span v-if="lowStockCount > 0" class="ml-auto bg-orange-200 text-orange-800 px-2 py-0.5 rounded-full text-xs">
              {{ lowStockCount }}
            </span>
          </router-link>
        </div>
      </div>
    </div>
  </aside>
</template>