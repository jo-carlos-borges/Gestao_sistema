<script setup lang="ts">
import { defineProps, computed } from 'vue';
import type { Item } from '../../types';

const props = defineProps<{
  item: Item;
}>();

const priorityClass = computed(() => {
  switch (props.item.priority) {
    case 'HIGH': return 'bg-error-50 text-error-700 border-error-200';
    case 'MEDIUM': return 'bg-warning-50 text-warning-700 border-warning-200';
    case 'LOW': return 'bg-success-50 text-success-700 border-success-200';
    default: return 'bg-gray-50 text-gray-700 border-gray-200';
  }
});

const quantityClass = computed(() => {
  if (props.item.quantity <= 0) {
    return 'text-error-700';
  } else if (props.item.quantity <= 2) {
    return 'text-warning-700';
  } else {
    return 'text-success-700';
  }
});

const latestPrice = computed(() => {
  if (!props.item.prices || props.item.prices.length === 0) {
    return null;
  }
  
  // Find the most recent price
  return props.item.prices.reduce((latest, current) => {
    if (!latest) return current;
    
    const latestDate = new Date(latest.date).getTime();
    const currentDate = new Date(current.date).getTime();
    
    return currentDate > latestDate ? current : latest;
  }, null as any);
});

const formatPrice = (value: number) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
};
</script>

<template>
  <div class="card hover:shadow-md transition-shadow duration-200">
    <div class="flex justify-between items-start mb-2">
      <h3 class="text-lg font-medium text-gray-900">{{ item.name }}</h3>
      <span :class="`${priorityClass} text-xs px-2 py-1 rounded-full border`">
        {{ item.priority }}
      </span>
    </div>
    
    <div class="mb-2 text-sm text-gray-600">
      Category: {{ item.category?.name || 'Uncategorized' }}
    </div>
    
    <div class="flex justify-between items-center mt-3">
      <div :class="quantityClass" class="font-medium">
        Quantity: {{ item.quantity }}
      </div>
      
      <div v-if="latestPrice" class="text-primary-700 font-medium">
        {{ formatPrice(latestPrice.value) }}
      </div>
      <div v-else class="text-gray-500 text-sm">
        No price data
      </div>
    </div>
    
    <div class="mt-4 flex justify-end">
      <router-link :to="`/items/${item.id}`" class="text-primary-600 hover:text-primary-800 mr-4 text-sm">
        Details
      </router-link>
      <router-link :to="`/items/${item.id}/edit`" class="text-gray-600 hover:text-gray-800 text-sm">
        Edit
      </router-link>
    </div>
  </div>
</template>