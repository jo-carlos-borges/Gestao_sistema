import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { Item } from '../types';
import { itemsService } from '../services/items.service';

export const useItemsStore = defineStore('items', () => {
  const items = ref<Item[]>([]);
  const loading = ref<boolean>(false);
  const error = ref<string | null>(null);
  const currentItem = ref<Item | null>(null);

  const sortedByPriority = computed(() => {
    return [...items.value].sort((a, b) => {
      const priorityOrder = { HIGH: 0, MEDIUM: 1, LOW: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  });

  const groupedByCategory = computed(() => {
    const grouped: Record<number, Item[]> = {};
    
    items.value.forEach(item => {
      if (!grouped[item.categoryId]) {
        grouped[item.categoryId] = [];
      }
      grouped[item.categoryId].push(item);
    });
    
    return grouped;
  });

  const lowStockItems = computed(() => {
    return items.value.filter(item => item.quantity <= 2);
  });

  async function fetchItems() {
    try {
      loading.value = true;
      error.value = null;
      items.value = await itemsService.getItems();
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch items';
    } finally {
      loading.value = false;
    }
  }

  async function fetchItemById(id: number) {
    try {
      loading.value = true;
      error.value = null;
      currentItem.value = await itemsService.getItemById(id);
      return currentItem.value;
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch item';
      return null;
    } finally {
      loading.value = false;
    }
  }

  async function addItem(item: Omit<Item, 'id'>) {
    try {
      loading.value = true;
      error.value = null;
      const newItem = await itemsService.createItem(item);
      items.value.push(newItem);
      return newItem;
    } catch (err: any) {
      error.value = err.message || 'Failed to add item';
      return null;
    } finally {
      loading.value = false;
    }
  }

  async function updateItem(id: number, item: Partial<Item>) {
    try {
      loading.value = true;
      error.value = null;
      const updatedItem = await itemsService.updateItem(id, item);
      
      const index = items.value.findIndex(i => i.id === id);
      if (index !== -1) {
        items.value[index] = updatedItem;
      }
      
      if (currentItem.value?.id === id) {
        currentItem.value = updatedItem;
      }
      
      return updatedItem;
    } catch (err: any) {
      error.value = err.message || 'Failed to update item';
      return null;
    } finally {
      loading.value = false;
    }
  }

  async function deleteItem(id: number) {
    try {
      loading.value = true;
      error.value = null;
      await itemsService.deleteItem(id);
      
      items.value = items.value.filter(item => item.id !== id);
      
      if (currentItem.value?.id === id) {
        currentItem.value = null;
      }
      
      return true;
    } catch (err: any) {
      error.value = err.message || 'Failed to delete item';
      return false;
    } finally {
      loading.value = false;
    }
  }

  async function addPriceToItem(itemId: number, price: { value: number, storeUrl: string }) {
    try {
      loading.value = true;
      error.value = null;
      const updatedItem = await itemsService.addPriceToItem(itemId, price);
      
      const index = items.value.findIndex(i => i.id === itemId);
      if (index !== -1) {
        items.value[index] = updatedItem;
      }
      
      if (currentItem.value?.id === itemId) {
        currentItem.value = updatedItem;
      }
      
      return updatedItem;
    } catch (err: any) {
      error.value = err.message || 'Failed to add price';
      return null;
    } finally {
      loading.value = false;
    }
  }

  return {
    items,
    loading,
    error,
    currentItem,
    sortedByPriority,
    groupedByCategory,
    lowStockItems,
    fetchItems,
    fetchItemById,
    addItem,
    updateItem,
    deleteItem,
    addPriceToItem,
  };
});