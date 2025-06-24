import { Item } from '../types';
import { mockItemsApi } from './mock-api';

// In a real app, this would use the real API
// For demo, we're using the mock API
export const itemsService = {
  async getItems() {
    return mockItemsApi.getItems();
  },
  
  async getItemById(id: number) {
    return mockItemsApi.getItemById(id);
  },
  
  async createItem(item: Omit<Item, 'id'>) {
    return mockItemsApi.createItem(item);
  },
  
  async updateItem(id: number, updates: Partial<Item>) {
    return mockItemsApi.updateItem(id, updates);
  },
  
  async deleteItem(id: number) {
    return mockItemsApi.deleteItem(id);
  },
  
  async addPriceToItem(itemId: number, price: { value: number, storeUrl: string }) {
    return mockItemsApi.addPriceToItem(itemId, price);
  }
};